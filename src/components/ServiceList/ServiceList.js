import React, { Component } from "react";
import Axios from "axios";
import Service from "./Service/Service";
import "./ServiceList.css";
export default class ServiceList extends Component {
  state = {
    services: []
  };

  // Invoked immediately after a component is mounted (inserted into the tree)
  componentDidMount() {
    Axios.get("http://dgirotto.a2hosted.com/api/service/read.php").then(res => {
      this.setState({ services: res.data });
    });
  }

  render() {
    return (
      <div className="services">
        {this.state.services.map(service => (
          <Service key={service.serviceId} service={service} />
        ))}
      </div>
    );
  }
}
