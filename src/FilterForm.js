import React from "react";
import "./App.css";


function FilterForm(props){
    let locationsList = props.FilteredLocations.map((location) =>
	<li className="myLi" tabIndex="0" key={location.venueID} onClick={()=> props.handleLocationClick(location.venueID)}><a>{location.title}</a></li>
	);

return (
      <div>
      <form>
        <label>
          <input type="text" id="myInput" placeholder="Search" onChange={(event) => props.handleTextFilter(event)} />
          <ul id="myUL">
            {locationsList}
          </ul>
        </label>
      </form>
      </div>
  );

}

export default FilterForm;