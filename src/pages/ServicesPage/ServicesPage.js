import React, { Component } from "react";
import Card from "@material-ui/core/Card";
import Backdrop from "../../components/UI/Backdrop/Backdrop";
import Auxil from "../../helpers/Auxil";
import Title from "../../components/UI/Title/Title";
import "./ServicesPage.css";
import { ServicesService } from "../../services/service";

import Alert from "@material-ui/lab/Alert";

class ServicesPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      services: null,
      isLoading: false
    };
  }

  componentDidMount() {
    this.setState({ isLoading: true });

    ServicesService.getServices(false)
      .then(res => {
        this.setState({ services: res.data, isLoading: false });
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
      <div className="services-page-container">
        {this.state.services && (
          <Auxil>
            <Title>SERVICES</Title>
            {!this.props.isAuth ? (
              <Alert style={{ marginBottom: "20px" }} severity="info" color="info"><a href="/login">Login</a> and select from our several services!</Alert>
            ) : null}
            <div className="services">
              {this.state.services.map(service => (
                <Card
                  onClick={() =>
                    this.serviceCardClickHandler(service.serviceId)
                  }
                  key={service.serviceId}
                  className="service"
                  variant="outlined"
                >
                  <h2 className="service-title">
                    {service.serviceName.toUpperCase()}
                  </h2>
                </Card>
              ))}
            </div>
          </Auxil>
        )}
        {this.state.isLoading ? <Backdrop /> : null}
      </div>
    );
  }
}

export default ServicesPage;
