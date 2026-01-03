import React from "react";

function CampusItem({ image, name, location }) {
  return (
    <div className="menuItem">
      <div style={{ backgroundImage: `url(${image})` }}> </div>
      <h1> {name} </h1>
      <p> {location} </p>
    </div>
  );
}

export default CampusItem;
