import React, { Component } from "react";
import Loader from "../Loader/Loader";
import Axios from "axios";
import Service from "./Service/Service";
import "./ServiceList.css";

export default class ServiceList extends Component {
  state = {
    isLoading: true,
    services: []
  };

  // Invoked immediately after a component is mounted (inserted into the tree)
  componentDidMount() {
    this.setState({ isLoading: true });
    Axios.get("http://dgirotto.a2hosted.com/api/service/read.php")
      .then(res => {
        this.setState({ services: res.data });
        this.setState({ isLoading: false });
      })
      .catch(err => {
        console.error("Error while getting services: " + err.response);
      });
  }

  render() {
    return (
      <div>
        <div className="services">
          {this.state.services.map(service => (
            <Service key={service.serviceId} service={service} />
          ))}
        </div>
        {this.state.isLoading ? <Loader size={80} /> : null}
      </div>
    );
  }
}
