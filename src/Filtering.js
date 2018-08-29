import React from "react";
import "./App.css";


function Filtering(props){
    let locationsList = props.FilteredLocations.map((location) =>
	<li id="venuesList" tabIndex="0" key={location.venueID} onClick={()=> props.handleLocationClick(location.venueID)}><a>{location.title}</a></li>
	);

return (
      <div>
      <form>
        <label>
          <input type="text" id="searchField" placeholder="Search" onChange={(event) => props.handleTextFilter(event)} />
          <ul id="venuesList">
            {locationsList}
          </ul>
        </label>
      </form>
      </div>
  );

}

export default Filtering;