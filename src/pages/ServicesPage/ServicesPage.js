import React, { Component } from "react";
import Card from "@material-ui/core/Card";
import Backdrop from "../../components/UI/Backdrop/Backdrop";
import Auxil from "../../helpers/Auxil";
import Title from "../../components/UI/Title/Title";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import "./ServicesPage.css";
import { ServicesService } from "../../services/service";

class ServicesPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      services: null,
      isLoading: false,
      isOpen: false
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
    if (this.props.isAuth) {
      window.location.href = "/services/" + arg;
    }
    else {
      this.setState({ isOpen: true });
    }
  };

  handleClose = () => {
    this.setState({ isOpen: false });
  }

  render() {
    return (
      <div className="page-container">
        {!this.state.isLoading && this.state.services ? (
          <Auxil>
            <Title>SERVICES</Title>
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
        ) : <Backdrop />}

        <Dialog
          open={this.state.isOpen}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle style={{ background: "#fbfbfb" }} id="alert-dialog-title">Please login to continue</DialogTitle>
          <DialogContent style={{ background: "#fbfbfb" }}>
            <DialogContentText style={{ textAlign: "center" }} id="alert-dialog-description">
              <Button
                className="home-button"
                onClick={() => (window.location.href = "/login")}
                variant="contained"
                color="primary"
              >
                LOGIN
              </Button>
              <span style={{ display: "block", padding: "10px 0" }}>Don't have an account?</span>
              <Button
                className="home-button"
                onClick={() => (window.location.href = "/register")}
                variant="contained"
                color="primary"
              >
                REGISTER
              </Button>
            </DialogContentText>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

export default ServicesPage;
