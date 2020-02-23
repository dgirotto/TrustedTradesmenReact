import React, { Component } from "react";
import ServiceList from "../../components/ServiceList/ServiceList";
import Title from "../../components/UI/Title/Title";
import "./ServicesPage.css";

class ServicesPage extends Component {
  render() {
    return (
      <div>
        <Title size="Large" color="Black">
          Services
        </Title>
        <ServiceList />
      </div>
    );
  }
}

export default ServicesPage;
