import React from "react";
import { Link } from "react-router-dom";
import { FaInstagram, FaLinkedin, FaFacebook, FaTwitter, FaRegEdit, FaUserCog, FaSignOutAlt, FaRegUser } from "react-icons/fa";
import DrawerToggleButton from "../SideDrawer/DrawerToggleButton";
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
                  <div onClick={() => props.handleOpen(false)} className="nav-item-top">
                    <span style={{ paddingRight: "8px" }}>Login</span>
                    <FaSignOutAlt size="18" />
                  </div>
                  <div onClick={() => props.handleOpen(true)} className="nav-item-top">
                    <span style={{ paddingRight: "8px" }}>Register Now</span>
                    <FaRegEdit size="18" />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="toolbar-bottom-container">
          <div className="toolbar-bottom">
            <Link style={{ height: "100%" }} to="/">
              <img height="100%" src={process.env.PUBLIC_URL + '/images/logo-no-text.png'} />
            </Link>
            <div className="nav-items-bottom">
              {(!props.isAuth || props.isAuth && props.userType === 0) && (
                <Link to="/services">
                  <div className="nav-item-bottom">
                    Our Services
                </div>
                </Link>
              )}
              {props.isAuth && (
                <>
                  {(props.userType === 1 || props.userType === 3) && (
                    <Link to="/leads">
                      <div className="nav-item-bottom">
                        My Leads
                    </div>
                    </Link>
                  )}
                  <Link to="/jobs">
                    <div className="nav-item-bottom">
                      My Jobs
                  </div>
                  </Link>
                  {(props.userType === 1) && (
                    <Link to={"/contractors/" + props.userId}>
                      <div className="nav-item-bottom">
                        My Profile
                    </div>
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="toolbar-mobile">
        <div style={{ width: "30px" }}>
          <DrawerToggleButton click={props.drawerToggleClickHandler} />
        </div>
        <div className="toolbar-verbiage">
          TRUSTED TRADESMEN
        </div>
        <div style={{ width: "30px" }} />
      </div>
    </>
  );
};

export default ToolBar;
