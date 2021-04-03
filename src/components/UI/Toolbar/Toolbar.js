import React from "react";
import { Link } from "react-router-dom";
import { FaRegHandshake } from "react-icons/fa";
import DrawerToggleButton from "../SideDrawer/DrawerToggleButton";

import "./Toolbar.css";

const ToolBar = props => {
  return (
    <header className="toolbar">
      <nav className="toolbar__navigation">
        <div className="toolbar__toggle-button">
          <DrawerToggleButton click={props.drawerToggleClickHandler} />
        </div>
        <div className="toolbar__logo">
          <Link to="/">
            <FaRegHandshake className="logo-icon" size="35" />
            <div className="logo-text">TRUSTED TRADESMEN</div>
          </Link>
        </div>
        <div className="spacer" />
        <div className="toolbar__navigation-items">
          <ul>
            <Link to="/">
              <li>Home</li>
            </Link>
            {(!props.isAuth || (props.isAuth && props.userType === 0)) && (
              <Link to="/services">
                <li>Services</li>
              </Link>
            )}
            {props.isAuth ? (
              <>
                {(props.userType === 1 || props.userType === 3) && (
                  <Link to="/leads">
                    <li>Leads</li>
                  </Link>
                )}
                <Link to="/jobs">
                  <li>Jobs</li>
                </Link>
                <Link to="/settings">
                  <li>Settings</li>
                </Link>
                <Link to="/logout">
                  <li onClick={props.logout}>
                    Logout
                  </li>
                </Link>
              </>
            ) : (
              <>
                <Link to="/login">
                  <li>Login</li>
                </Link>
                <Link to="/register">
                  <li>Register</li>
                </Link>
              </>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default ToolBar;
