import React from "react";
import { CampusesList } from "../data/CampusesList";
import CampusItem from "../components/CampusItem";
import "../styles/Menu.css";



function Menu() {
  return (
    <div className="menu">
      <h1 className="menuTitle">Our Campuses</h1>
      <div className="menuList">
        {CampusesList.map((campusItem, key) => {
          return (
            <CampusItem
              key={key}
              image={campusItem.image}
              name={campusItem.name}
              location={campusItem.location}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Menu;
