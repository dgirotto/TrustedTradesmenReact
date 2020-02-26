import React, { Component } from "react";
import { Link } from "react-router-dom";
import { FaRegHandshake } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import Aux from "../../../helpers/Aux";
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
            <FaRegHandshake size="35" />
            <span className="logo-text">TRUSTED TRADESMEN</span>
          </Link>
        </div>
        <div className="spacer" />
        <div className="toolbar__navigation-items">
          <ul>
            <Link to="/">
              <li>HOME</li>
            </Link>
            <Link to="/services">
              <li>SERVICES</li>
            </Link>
            {props.isAuth ? (
              <Aux>
                {/* <Link to="/contractors">
                  <li>CONTRACTORS</li>
                </Link> */}
                <Link to="/leads">
                  <li>LEADS</li>
                </Link>
                <Link to="/jobs">
                  <li>JOBS</li>
                </Link>
                <Link to="/account">
                  <li>ACCOUNT</li>
                </Link>
                <Link className="logout-link" to="/logout">
                  <li onClick={props.logout}>
                    <FiLogOut size="20" />
                  </li>
                </Link>
              </Aux>
            ) : (
              <Link to="/login">
                <li>LOGIN</li>
              </Link>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default ToolBar;
