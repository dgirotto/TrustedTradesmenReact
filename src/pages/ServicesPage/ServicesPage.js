import React, { Component } from "react";
import Card from "@material-ui/core/Card";
import Backdrop from "../../components/UI/Backdrop/Backdrop";
import Aux from "../../helpers/Aux";
import Title from "../../components/UI/Title/Title";
import "./ServicesPage.css";
import { ServicesService } from "../../services/service";

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

    ServicesService.getServices()
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
          <Aux>
            <Title>SERVICES</Title>
            {!this.props.isAuth ? (
              <p>
                <a href="/login">Login</a> and choose from our several services!
              </p>
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
                  <h2 className="form-title service-title">
                    {service.serviceName.toUpperCase()}
                  </h2>
                  <p>{service.description}</p>
                </Card>
              ))}
            </div>
          </Aux>
        )}
        {this.state.isLoading ? <Backdrop /> : null}
      </div>
    );
  }
}

export default ServicesPage;
