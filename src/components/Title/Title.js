import React from "react";
import "./Title.css";

const title = props => {
  return (
    <h1 className={"Title " + props.size + " " + props.color}>
      {props.children}
    </h1>
  );
};

export default title;
