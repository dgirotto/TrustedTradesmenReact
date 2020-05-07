import React from "react";
import Title from "../../UI/Title/Title";
import "./Service.css";

const service = props => (
  <div onClick={() => props.click(props.service.serviceId)} className="service">
    <Title size="Small" color="Red">
      {props.service.serviceName}
    </Title>
    <p>{props.service.description}</p>
  </div>
);

export default service;
