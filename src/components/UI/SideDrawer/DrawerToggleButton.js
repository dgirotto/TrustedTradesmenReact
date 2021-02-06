import React from "react";
import "./DrawerToggleButton.css";
import { FaBars } from "react-icons/fa";

const drawerToggleButton = props => (
  <FaBars className="toggle-button" size="30" onClick={props.click} />
);

export default drawerToggleButton;
