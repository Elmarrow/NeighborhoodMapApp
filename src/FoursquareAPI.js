import React, { Component } from "react";
import "./App.css";
import logo from "./foursquare.svg"

// https://github.com/foursquare/react-foursquare
var foursquare = require("react-foursquare")({
	clientID: "PHCE23LYGNQCQIAFXNTKYQQJVAFIMLZUB3QH4CG00DRVJS2U",
	clientSecret: "K2GS2P2GLCM1UKPN2WMIT2ZKMC55GULLKO2I1UXNFJZGQSMJ"
});

class Foursquare extends Component {

	constructor(props) {
	 super(props);
	 this.state = {
		items: null,
		// state passed in from app component
		latlng: {"ll": this.props.lattitude.toString() + "," + this.props.longitude.toString(),
		"query": this.props.titleQuery},
		// venue id
		venid: { "venue_id": this.props.theVenueID },
	};
	}

	// make venue detail api request and set as item state
  componentDidMount() {
	foursquare.venues.getVenue(this.state.venid)
		.then(res => {
		this.setState({ items: res.response.venue });
		}).catch(err => {
		alert(err)
		});
	}

	render() {
	if (!this.state.items) {
		let formattedAddress = null
		return "Fetching Data...";
	} else {
		let formattedAddress = this.state.items.location.address
		return (
		<div>
		<div ref="testin"></div>
			<div key={this.state.items.id}>
			<h3>{this.state.items.name}</h3>
			<p><strong>Address:</strong>  {formattedAddress}</p>
			<p><strong>Data Provider: </strong><img className="img" src={logo} alt={"Foursquare logo"}/></p>
		</div>
		</div>
	)
	}
	}
}

export default Foursquare