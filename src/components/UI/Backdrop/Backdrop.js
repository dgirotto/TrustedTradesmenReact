import React from "react";
import "./Backdrop.css";
import Loader from "../Loader/Loader";

const backdrop = props => (
  <div onClick={props.click} className="backdrop">
    {props.hideLoader ? null : <Loader size={60} />}
  </div>
);
export default backdrop;
