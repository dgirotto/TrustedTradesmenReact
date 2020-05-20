import React from "react";
import Card from "@material-ui/core/Card";
import Title from "../../UI/Title/Title";
import "./Service.css";

const service = props => (
  <Card
    onClick={() => props.click(props.service.serviceId)}
    className="service"
  >
    <Title size="Small">{props.service.serviceName.toUpperCase()}</Title>
    <p>{props.service.description}</p>
  </Card>
);

export default service;
