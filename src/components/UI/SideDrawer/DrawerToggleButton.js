import React from "react";
import "./DrawerToggleButton.css";
import { GiHamburgerMenu } from "react-icons/gi";

const drawerToggleButton = props => (
  <GiHamburgerMenu className="toggle-button" size="40" onClick={props.click} />
);

export default drawerToggleButton;
