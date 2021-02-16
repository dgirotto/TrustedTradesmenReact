import React from "react";
import { Link } from "react-router-dom";
import { FaRegHandshake } from "react-icons/fa";
import Auxil from "../../../helpers/Auxil";
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
              <li>
                Home
              </li>
            </Link>
            <Link to="/services">
              <li>Services</li>
            </Link>
            {props.isAuth ? (
              <Auxil>
                {props.userType !== 0 && props.userType !== 2 ? (
                  <Link to="/leads">
                    <li>Leads</li>
                  </Link>
                ) : null}
                <Link to="/jobs">
                  <li>Jobs</li>
                </Link>
                <Link to="/settings">
                  <li>Account</li>
                </Link>
                <Link to="/logout">
                  <li onClick={props.logout}>
                    Logout
                  </li>
                </Link>
              </Auxil>
            ) : (
                <Auxil>
                  <Link to="/login">
                    <li>Login</li>
                  </Link>
                  <Link to="/register">
                    <li>Register</li>
                  </Link>
                </Auxil>
              )}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default ToolBar;
