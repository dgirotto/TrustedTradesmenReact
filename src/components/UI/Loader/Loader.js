import React from "react";
import "./Loader.css";
import CircularProgress from "@material-ui/core/CircularProgress";

const loader = props => (
  <div className="Loader">
    <CircularProgress size={props.size} color="secondary" />
  </div>
);

export default loader;
