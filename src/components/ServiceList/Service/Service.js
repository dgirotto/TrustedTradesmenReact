import React from "react";
import Title from "../../Title/Title";
import "./Service.css";

const service = props => (
  <div className="service">
    <Title size="Small" color="Black">
      {props.service.serviceName}
    </Title>
    <p>{props.service.description}</p>
  </div>
);

export default service;
