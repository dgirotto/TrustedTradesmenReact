import React from "react";
import { Link } from "react-router-dom";
import { RiCloseLine } from "react-icons/ri";

import "./SideDrawer.css";

const sideDrawer = props => {
  let drawerClasses = "side-drawer";

  if (props.show) {
    drawerClasses = "side-drawer open";
  }

  return (
    <nav className={drawerClasses}>
      <RiCloseLine
        className="close-icon"
        size="43"
        onClick={props.drawerToggleClickHandler}
      />
      <ul>
        <Link onClick={props.drawerToggleClickHandler} to="/">
          <li>Home</li>
        </Link>
        {(!props.isAuth || (props.isAuth && props.userType === 0)) && (
          <Link onClick={props.drawerToggleClickHandler} to="/services">
            <li>Our Services</li>
          </Link>
        )}
        {props.isAuth ? (
          <>
            {(props.userType === 1 || props.userType === 3) && (
              <Link onClick={props.drawerToggleClickHandler} to="/leads">
                <li>My Leads</li>
              </Link>
            )}
            <Link onClick={props.drawerToggleClickHandler} to="/jobs">
              <li>My Jobs</li>
            </Link>
            {(props.userType === 1) && (
              <Link onClick={props.drawerToggleClickHandler} to={"/contractors/" + props.userId}>
                <li>My Profile</li>
              </Link>
            )}
            <Link onClick={props.drawerToggleClickHandler} to="/account">
              <li>My Account</li>
            </Link>
            <Link
              onClick={() => {
                props.logout();
                props.drawerToggleClickHandler();
              }}
              to="/logout"
            >
              <li>Logout</li>
            </Link>
          </>
        ) : (
          <>
            <li onClick={() => props.handleOpen(false)}>Login</li>
            <li onClick={() => props.handleOpen(true)}>Register</li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default sideDrawer;
