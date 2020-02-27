import React, { Component } from "react";
import Axios from "axios";
import Service from "./Service/Service";
import Title from "../../components/UI/Title/Title";
import Aux from "../../helpers/Aux";
import "./ServiceList.css";

export default class ServiceList extends Component {
  state = {
    services: null
  };

  // Invoked immediately after a component is mounted (inserted into the tree)
  componentDidMount() {
    this.setState({ isLoading: true });

    Axios.get("http://dgirotto.a2hosted.com/api/service/read.php")
      .then(res => {
        this.setState({ services: res.data });
        this.props.isDoneLoading();
      })
      .catch(err => {
        console.error("Error while getting services: " + err.response);
      });
  }

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
                <Service key={service.serviceId} service={service} />
              ))}
            </div>
          </Aux>
        )}
      </Aux>
    );
  }
}
