import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import "./Loader.css";
const loader = props => (
  <CircularProgress className="loader" size={props.size} />
);

export default loader;
