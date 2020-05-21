import React from "react";
import "./Backdrop.css";
import Loader from "../Loader/Loader";

const backdrop = props => (
  <div onClick={props.click} className="backdrop">
    <Loader size={60} />
  </div>
);
export default backdrop;
