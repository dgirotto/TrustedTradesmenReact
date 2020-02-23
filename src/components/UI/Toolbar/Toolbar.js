import React from "react";
import { Link } from "react-router-dom";
import { FaRegHandshake } from "react-icons/fa";
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
        <Link to="/">
          <FaRegHandshake size="35" />
        </Link>
      </div>
      <div className="spacer" />
      <div className="toolbar__navigation-items">
        <ul>
          <Link to="/services">
            <li>Services</li>
          </Link>
          <Link to="/jobs">
            <li>Jobs</li>
          </Link>
          <Link to="/account">
            <li>Account</li>
          </Link>
          <Link to="/login">
            <li>Login</li>
          </Link>
          <Link to="/logout">
            <li>Logout</li>
          </Link>
        </ul>
      </div>
    </nav>
  </header>
);

export default toolbar;
