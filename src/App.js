import React, {Component} from "react";

import ReactDOM from "react-dom";
import "./App.css";
import {slide as Menu} from "react-burger-menu";
import {MapStyle} from './Mapstyles.js';
import {locationData} from './Locations.js';
import Foursquare from "./FoursquareAPI";
import Filtering from "./Filtering";

let _this;
let map;
let markers = [];
let iw;

class App extends Component {

	state = {
		googleMap: [],
		initialLocations: locationData,
		filteredLocations: locationData,
		markerIdentification: null,
		menuOpen: false
	}

	componentDidMount() {
		_this = this
		const fetchGoogleMaps = require("fetch-google-maps");
		//fetch google maps api and create a new map
		fetchGoogleMaps({
			apiKey: "AIzaSyC7uYChVm0w8cDKMlGmon0XbJDUiiBBc4g",
			language: "en",
			libraries: ["geometry"]
		}).then((maps) => {
			const map = new maps.Map(document.getElementById("map"), {
				zoom: 12,
				center: new maps.LatLng(37.97551136676495, 23.73456932693872),
				styles: MapStyle
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
		iw = new google.maps.InfoWindow();
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

			marker.addListener("click", () => {
				marker.setAnimation(google.maps.Animation.BOUNCE);
				this.populateInfoWindow(marker, iw);
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

			let iwDiv = document.createElement("div");
			let fsquareAPI = < Foursquare lattitude = {
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
			ReactDOM.render(fsquareAPI, iwDiv);
			infowindow.setContent(iwDiv);

			infowindow.open(map, marker);
			infowindow.addListener("closeclick", function () {
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
		_this.populateInfoWindow(clickedMarker[0], iw);
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
					alert("oops! that didn't work")
				}
			}
		}

		return (
		<div className = "App">
			<header className = "App-header">
			<h1 className = "App-title"> Neighborhood Maps Project - Cool spots in Athens</h1> 
			</header> 
			<div>
			<Menu width = {"32%"}
			isOpen = {this.state.menuOpen}
			onStateChange = {(state) => this.handleStateChange(state)}>
			<Filtering FilteredLocations = {this.state.filteredLocations}
			handleTextFilter = {this.handleTextFilter.bind(this)}
			handleLocationClick = {this.handleLocationClick}
			/> 
			</Menu> 
			</div>
			<div id = "map">
			</div>
			<footer>
			<p>FEND Final Project - Made with ReactJS - <a href='https://github.com/Elmarrow/NeighborhoodMapApp'>GitHub</a></p>
		</footer>
			</div>
			
		);
	}
}

export default App;