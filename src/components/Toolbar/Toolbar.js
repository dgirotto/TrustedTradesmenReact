import React from "react";
import DrawerToggleButton from "../SideDrawer/DrawerToggleButton";

import "./Toolbar.css";

// NOTE: Use "()" when only returning one statement;
// Use "{}" along with a "return()" statement to execute multiple sta tements
const toolbar = props => (
  <header className="toolbar">
    <nav className="toolbar__navigation">
      <div className="toolbar__toggle-button">
        {/* Forward the reference to drawerClickHandler function to the button component */}
        <DrawerToggleButton click={props.drawerToggleClickHandler} />
      </div>
      <div className="toolbar__logo">
        <a href="/">THE LOGO</a>
      </div>
      <div className="spacer" />
      <div className="toolbar__navigation-items">
        <ul>
          <li>
            {/* TODO: Add routerlink here */}
            <a href="/">Services</a>
          </li>
          <li>
            <a href="/">Account</a>
          </li>
        </ul>
      </div>
    </nav>
  </header>
);

export default toolbar;
