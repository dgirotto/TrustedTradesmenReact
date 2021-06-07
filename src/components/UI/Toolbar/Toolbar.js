import React from "react";
import { Link } from "react-router-dom";
import DrawerToggleButton from "../SideDrawer/DrawerToggleButton";
import { FaInstagram, FaLinkedin, FaFacebook, FaTwitter, FaRegEdit, FaUserCog, FaSignOutAlt, FaRegUser } from "react-icons/fa";

import "./Toolbar.css";

const ToolBar = props => {
  return (
    <>
      <div className="toolbar-desktop">
        <div className="toolbar-top-container">
          <div className="toolbar-top">
            <div className="socials-container">
              <a href="https://www.instagram.com" target="blank"><FaInstagram size="20" /></a>
              <a href="https://www.facebook.com" target="blank"><FaFacebook size="20" /></a>
              <a href="https://www.twitter.com" target="blank"><FaTwitter size="20" /></a>
              <a href="https://www.linkedin.com" target="blank"><FaLinkedin size="20" /></a>
            </div>
            <div className="nav-items-top">
              {props.isAuth ? (
                <>
                  <Link to="/account">
                    <div className="nav-item-top">
                      <span style={{ paddingRight: "5px" }}>My Account</span>
                      <FaRegUser size="16" />
                    </div>
                  </Link>
                  <Link to="/logout">
                    <div className="nav-item-top" onClick={props.logout}>
                      <span style={{ paddingRight: "5px" }}>Logout</span>
                      <FaSignOutAlt size="18" />
                    </div>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/register">
                    <div className="nav-item-top">
                      <span style={{ paddingRight: "5px" }}>Register Now</span>
                      <FaRegEdit size="18" />
                    </div>
                  </Link>
                  <Link to="/login">
                    <div className="nav-item-top">
                      <span style={{ paddingRight: "5px" }}>Login</span>
                      <FaSignOutAlt size="18" />
                    </div>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="toolbar-bottom">
          <img height="100%" src={process.env.PUBLIC_URL + '/images/logo-no-text.png'} />
          <div >
            OTHER LINKS
          </div>
        </div>
      </div>

      {/* <div className="toolbar-mobile">
        <div className="toolbar-toggle-button">
          <DrawerToggleButton click={props.drawerToggleClickHandler} />
        </div>
      </div> */}
    </>
  );
};

export default ToolBar;
