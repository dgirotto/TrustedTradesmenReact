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
        {props.isAuth ? (
          <>
            {props.userType === 0 && (
              <Link onClick={props.drawerToggleClickHandler} to="/services">
                <li>New Job</li>
              </Link>
            )}
            {(props.userType === 1 || props.userType === 3) && (
              <Link onClick={props.drawerToggleClickHandler} to="/leads">
                <li>Leads</li>
              </Link>
            )}
            <Link onClick={props.drawerToggleClickHandler} to="/jobs">
              <li>Jobs</li>
            </Link>
            <Link onClick={props.drawerToggleClickHandler} to="/settings">
              <li>Account</li>
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
              <Link onClick={props.drawerToggleClickHandler} to="/services">
                <li>New Job</li>
              </Link>
              <Link onClick={props.drawerToggleClickHandler} to="/login">
                <li>Login</li>
              </Link>
              <Link onClick={props.drawerToggleClickHandler} to="/register">
                <li>Register</li>
              </Link>
            </>
          )}
      </ul>
    </nav>
  );
};

export default sideDrawer;
