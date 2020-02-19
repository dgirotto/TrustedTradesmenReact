import React from "react";
import "./Service.css";

const service = props => (
  <div className="service">
    <h3 className="service__title">{props.service.serviceName}</h3>
    <p>{props.service.description}</p>
  </div>
);

export default service;
