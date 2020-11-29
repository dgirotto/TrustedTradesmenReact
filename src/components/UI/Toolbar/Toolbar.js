import React from "react";
import { Link } from "react-router-dom";
import { FaRegHandshake } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { AiOutlineHome } from "react-icons/ai";
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
            <span className="logo-text">TRUSTED TRADESMEN</span>
          </Link>
        </div>
        <div className="spacer" />
        <div className="toolbar__navigation-items">
          <ul>
            <Link to="/">
              <li className="icon-link">
                <AiOutlineHome size="20" />
              </li>
            </Link>
            <Link to="/services">
              <li>SERVICES</li>
            </Link>
            {props.isAuth ? (
              <Auxil>
                {/* <Link to="/contractors">
                  <li>CONTRACTORS</li>
                </Link> */}
                {/* Contractors and Admins can access leads page */}
                {props.userType !== 0 && props.userType !== 2 ? (
                  <Link to="/leads">
                    <li>LEADS</li>
                  </Link>
                ) : null}
                <Link to="/jobs">
                  <li>JOBS</li>
                </Link>
                {/* {props.userType === 3 ? (
                  <Link to="/admin">
                    <li>ADMIN</li>
                  </Link>
                ) : null} */}
                <Link to="/settings">
                  {/* <li className="icon-link-settings">
                    <FiSettings size="18" />
                  </li> */}
                  <li>SETTINGS</li>
                </Link>
                <Link to="/logout">
                  <li className="icon-link" onClick={props.logout}>
                    <FiLogOut size="20" />
                  </li>
                </Link>
              </Auxil>
            ) : (
                <Auxil>
                  <Link to="/login">
                    <li>LOGIN</li>
                  </Link>
                  <Link to="/register">
                    <li>REGISTER</li>
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
