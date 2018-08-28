import React, {
	Component
} from 'react';
import ReactDOMServer from 'react-dom/server';
import ReactDOM from 'react-dom';
import './App.css';
import {
	bubble as Menu
} from 'react-burger-menu'
import Foursquare from './Foursquare.js';
import FilterForm from './FilterForm.js';;


let _this;
let map;
let markers = [];
let marker;
let largeInfoWindow;
let locationState = [{
		title: 'Herod Atticus Odeon',
		location: {
			lat: 37.970530163389085,
			lng: 23.724747515595258
		},
		venueID: '5b854be6f594df74475dbd84'
	},
	{
		title: 'Acropolis of Athens',
		location: {
			lat: 37.97047493109809,
			lng: 23.726050568585492
		},
		venueID: '4adcdadff964a5205b5821e3'
	},
	{
		title: 'Acropolis Museum',
		location: {
			lat: 37.96870011553452,
			lng: 23.728438856291216
		},
		venueID: '4b0fc38bf964a520af6423e3'
	},
	{
		title: 'Lycabettus Hill',
		location: {
			lat: 37.98410502914355,
			lng: 23.745746612548828
		},
		venueID: '4adcdadff964a5205c5821e3'
	},
	{
		title: 'Museum of Cycladic Art',
		location: {
			lat: 37.97584344774846,
			lng: 23.742230726445747
		},
		venueID: '4adcdadff964a520745821e3'
	},
	{
		title: 'National Archaeological Museum',
		location: {
			lat: 37.989026413413555,
			lng: 23.732528686523438
		},
		venueID: '4adcdadff964a520735821e3'
	},
	{
		title: 'Άμα Λάχει Chez Violette',
		location: {
			lat: 37.98791855550784,
			lng: 23.73682103210383
		},
		venueID: '4bf189db52bda5935faab1b7'
	},
	{
		title: 'Noel',
		location: {
			lat: 37.97766108250686,
			lng: 23.728692894138607
		},
		venueID: '5528418a498e9b8fc30ad28f'
	},
	{
		title: 'Baba Au Rum',
		location: {
			lat: 37.97737441054308,
			lng: 23.72987414814855
		},
		venueID: '4b3bf2d5f964a520fc7e25e3'
	},
	{
		title: 'Dude',
		location: {
			lat: 37.97726330846484,
			lng: 23.729022286889546
		},
		venueID: '4cf18d247e0da1cdb9569297'
	},
	{
		title: 'The Seven Jokers',
		location: {
			lat: 37.97693003073475,
			lng: 23.7328189747609
		},
		venueID: '4adcdadef964a520e35721e3'
	},
	{
		title: 'Ciné Paris',
		location: {
			lat: 37.971907349241064,
			lng: 23.730909457880912
		},
		venueID: '4c41fe313735be9aa44919a4'
	},
	{
		title: 'Barrett',
		location: {
			lat: 37.9780900134331,
			lng: 23.725637697293095
		},
		venueID: '55a17707498edc8d69e1defb'
	},
	{
		title: 'Talking Breads',
		location: {
			lat: 37.9866,
			lng: 23.734274
		},
		venueID: '5a2c38a54b78c5365a578683'
	}
]

class App extends Component {

	state = {
		googleMap: [],
		initialLocations: locationState,
		filteredLocations: locationState,
		markerIdentification: null,
		menuOpen: false
	}

	componentDidMount() {
		_this = this
		//http://www.klaasnotfound.com/2016/11/06/making-google-maps-work-with-react/
		//https://www.npmjs.com/package/fetch-google-maps
		const fetchGoogleMaps = require('fetch-google-maps');
		//fetch google maps api and create a new map
		fetchGoogleMaps({
			apiKey: 'AIzaSyC7uYChVm0w8cDKMlGmon0XbJDUiiBBc4g',
			language: 'en',
			libraries: ['geometry']
		}).then((maps) => {
			const map = new maps.Map(document.getElementById('map'), {
				zoom: 12,
				center: new maps.LatLng(37.97551136676495, 23.73456932693872),
				styles: [{
						"featureType": "administrative",
						"elementType": "all",
						"stylers": [{
							"visibility": "simplified"
						}]
					},
					{
						"featureType": "landscape",
						"elementType": "geometry",
						"stylers": [{
								"visibility": "simplified"
							},
							{
								"color": "#fcfcfc"
							}
						]
					},
					{
						"featureType": "poi",
						"elementType": "geometry",
						"stylers": [{
								"visibility": "simplified"
							},
							{
								"color": "#fcfcfc"
							}
						]
					},
					{
						"featureType": "road.highway",
						"elementType": "geometry",
						"stylers": [{
								"visibility": "simplified"
							},
							{
								"color": "#dddddd"
							}
						]
					},
					{
						"featureType": "road.arterial",
						"elementType": "geometry",
						"stylers": [{
								"visibility": "simplified"
							},
							{
								"color": "#dddddd"
							}
						]
					},
					{
						"featureType": "road.local",
						"elementType": "geometry",
						"stylers": [{
								"visibility": "simplified"
							},
							{
								"color": "#eeeeee"
							}
						]
					},
					{
						"featureType": "water",
						"elementType": "geometry",
						"stylers": [{
								"visibility": "simplified"
							},
							{
								"color": "#dddddd"
							}
						]
					}
				]

			});
			this.initMap(map, maps)
		}).catch(err => {
			alert(err)
		});
	}
	//create map, map markers, and infowindows
	initMap(map, maps) {
		const google = window.google;
		let locations = this.state.filteredLocations
		largeInfoWindow = new google.maps.InfoWindow();
		let bounds = new google.maps.LatLngBounds();
		for (let i = 0; i < locations.length; i++) {
			let position = locations[i].location;
			let title = locations[i].title;
			let venid = locations[i].venueID;
			let marker = new google.maps.Marker({
				map: map,
				position: position,
				title: title,
				markerID: venid,
				animation: google.maps.Animation.DROP,
				id: i
			});

			markers.push(marker);
			bounds.extend(marker.position);

			marker.addListener('click', () => {
				marker.setAnimation(google.maps.Animation.BOUNCE);
				this.populateInfoWindow(marker, largeInfoWindow);
			});
		}
		// make sure all markers fit on screen
		map.fitBounds(bounds);
	};
	// open and close infowindow on click + set foursquare component to infowindow content
	populateInfoWindow(marker, infowindow) {
		if (infowindow !== marker) {
			infowindow.marker = marker;
			let markerLat = marker.position.lat();
			let markerLon = marker.position.lng();
			let markerTitle = marker.title;
			let placeID = marker.markerID;

			let infowindowDiv = document.createElement('div');
			let foursquareStuff = < Foursquare lattitude = {
				markerLat
			}
			longitude = {
				markerLon
			}
			titleQuery = {
				markerTitle
			}
			theVenueID = {
				placeID
			}
			/>;
			ReactDOM.render(foursquareStuff, infowindowDiv);
			infowindow.setContent(infowindowDiv);

			infowindow.open(map, marker);
			infowindow.addListener('closeclick', function () {
				infowindow.setContent(null);
				marker.setAnimation(null);
			});
		}
	}
	// Filter menu options on text input
	handleTextFilter(event) {
		let initialState = this.state.initialLocations
		let updatedState = initialState.filter(thisVenue => {
			return thisVenue.title.toLowerCase().search(event.target.value.toLowerCase()) !== -1
		})
		this.setState(prevState => ({
			filteredLocations: updatedState
		}))
	}
	// Activate Info Window on menu click
	handleLocationClick(venueID) {
		const clickedMarker = markers.filter((marker) => marker.markerID === venueID);
		_this.populateInfoWindow(clickedMarker[0], largeInfoWindow);
	}


	// This keeps your state in sync with the opening/closing of the menu
	// via the default means, e.g. clicking the X, pressing the ESC key etc.
	handleStateChange(state) {
		this.setState({
			menuOpen: state.isOpen
		})
	}

	// This can be used to close the menu, e.g. when a user clicks a menu item
	closeMenu() {
		this.setState({
			menuOpen: false
		})
	}

	// This can be used to toggle the menu, e.g. when using a custom icon
	// Tip: You probably want to hide either/both default icons if using a custom icon
	// See https://github.com/negomi/react-burger-menu#custom-icons
	toggleMenu() {
		this.setState({
			menuOpen: !this.state.menuOpen
		})
	}


	render() {
		// before rendering check filtered state for map markers
		let markersToShow = []
		let markersToHide = []
		let renderMarkers = markers
		let renderedLocations = this.state.filteredLocations
		let moveThisID = []
		renderedLocations.map(location => {
			moveThisID.push(location.venueID)
		})
		// loop through lists and display/hide corresponding markers
		for (let t = 0; t < moveThisID.length; t++) {
			for (let p = 0; p < renderMarkers.length; p++) {
				if (moveThisID[t] === renderMarkers[p].markerID) {
					markersToShow.push(renderMarkers[p])
					markersToShow.forEach(mark => {
						mark.setVisible(true)
					});
				} else if (moveThisID[t] !== renderMarkers[p].markerID) {
					markersToHide.push(renderMarkers[p])
					markersToHide.forEach(mark => {
						mark.setVisible(false)
					});
				} else {
					alert('oops! that didn\'t work')
				}
			}
		}

		return (
		<div className = "App">
			<header className = "App-header">
			<	h1 className = "App-title" > Neighborhood Maps Project </h1> 
			</header> 
			<div>
			<Menu width = {'32%'}
			isOpen = {this.state.menuOpen}
			onStateChange = {(state) => this.handleStateChange(state)}>
			<FilterForm FilteredLocations = {this.state.filteredLocations}
			handleTextFilter = {this.handleTextFilter.bind(this)}
			handleLocationClick = {this.handleLocationClick}
			/> 
			</Menu> 
			</div>
			<div id = "map">
			</div>
			</div>
		);
	}
}

export default App;