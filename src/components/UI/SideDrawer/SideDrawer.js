import React from "react";
import { Link } from "react-router-dom";
import Aux from "../../../helpers/Aux";
import "./SideDrawer.css";
import { RiCloseLine } from "react-icons/ri";

const sideDrawer = props => {
  let drawerClasses = "side-drawer";

  if (props.show) {
    drawerClasses = "side-drawer open";
  }

  return (
    <nav className={drawerClasses}>
      <RiCloseLine
        class="close-icon"
        size="43"
        onClick={props.drawerToggleClickHandler}
      />
      <ul>
        <Link onClick={props.drawerToggleClickHandler} to="/">
          <li>Home</li>
        </Link>
        <Link onClick={props.drawerToggleClickHandler} to="/services">
          <li>Services</li>
        </Link>
        {props.isAuth ? (
          <Aux>
            <Link onClick={props.drawerToggleClickHandler} to="/contractors">
              <li>Contractors</li>
            </Link>
            <Link onClick={props.drawerToggleClickHandler} to="/leads">
              <li>Leads</li>
            </Link>
            <Link onClick={props.drawerToggleClickHandler} to="/jobs">
              <li>Jobs</li>
            </Link>
            <Link onClick={props.drawerToggleClickHandler} to="/account">
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
          </Aux>
        ) : (
          <Link onClick={props.drawerToggleClickHandler} to="/login">
            <li>Login</li>
          </Link>
        )}
      </ul>
    </nav>
  );
};

export default sideDrawer;
