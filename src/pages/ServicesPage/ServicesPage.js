import React, { Component } from "react";
import ServiceList from "../../components/ServiceList/ServiceList";
import "./ServicesPage.css";

class ServicesPage extends Component {
  render() {
    return (
      <div>
        <h3 className="services-page__title">Services</h3>
        <ServiceList />
      </div>
    );
  }
}

export default ServicesPage;
