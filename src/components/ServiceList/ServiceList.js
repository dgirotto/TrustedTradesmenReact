import React, { Component } from "react";
import Axios from "axios";
import Service from "./Service/Service";
import Title from "../../components/UI/Title/Title";
import Aux from "../../helpers/Aux";
import "./ServiceList.css";

export default class ServiceList extends Component {
  state = {
    services: null,
    isAuth: false
  };

  // Invoked immediately after a component is mounted (inserted into the tree)
  componentDidMount() {
    this.setState({ isLoading: true, isAuth: this.props.isAuth });

    Axios.get("http://dgirotto.a2hosted.com/api/service/read.php")
      .then(res => {
        this.setState({ services: res.data });
        this.props.isDoneLoading();
      })
      .catch(err => {
        console.error("Error while getting services: " + err.response);
      });
  }

  serviceCardClickHandler = arg => {
    window.location.href = "/services/" + arg;
  };

  render() {
    return (
      <Aux>
        {this.state.services && (
          <Aux>
            <Title size="Medium" color="Black">
              SERVICES
            </Title>
            <div className="services">
              {this.state.services.map(service => (
                <Service
                  click={this.serviceCardClickHandler}
                  key={service.serviceId}
                  service={service}
                />
              ))}
            </div>
          </Aux>
        )}
      </Aux>
    );
  }
}
