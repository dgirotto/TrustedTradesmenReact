import React from "react";
import "./Title.css";

const title = props => {
  return (
    <h1
      className={"Title " + props.size + " " + props.color + " " + props.align}
    >
      {props.children}
    </h1>
  );
};

export default title;
