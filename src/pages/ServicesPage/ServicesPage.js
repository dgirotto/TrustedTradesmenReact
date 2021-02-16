import React, { Component } from "react";
import Card from "@material-ui/core/Card";
import Backdrop from "../../components/UI/Backdrop/Backdrop";
import Auxil from "../../helpers/Auxil";
import Title from "../../components/UI/Title/Title";
import Button from '@material-ui/core/Button';
import TextField from "@material-ui/core/TextField";
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
      filteredServices: null,
      searchContent: "",
      isLoading: false,
      isOpen: false
    };
  }

  componentDidMount() {
    this.setState({ isLoading: true });

    ServicesService.getServices()
      .then(res => {
        // Tokenize search terms
        res.data.forEach(item => {
          item.searchTerms = item.searchTerms.split(';');
        })

        this.setState({
          services: res.data,
          filteredServices: res.data,
          isLoading: false
        });
      })
      .catch(err => {
        console.error("Error while getting services: " + err.response);
      });
  }

  searchChange = event => {
    var filteredServicesNew = [];

    if (event.target.value.trim() === "") {
      filteredServicesNew = this.state.services;
    }
    else {
      // Filter services on search terms
      this.state.services.forEach(item => {
        if (item.searchTerms.some(r => r.includes(event.target.value.toLowerCase()))) {
          filteredServicesNew.push(item);
        }
      });
    }

    this.setState({
      filteredServices: filteredServicesNew,
      searchContent: event.target.value
    });
  }

  setModal = modalType => {
    if (modalType === 0) {
      // Must log in modal
      // console.log("SET MUST LOG IN MODAL");
    }
    else {
      // No contractors found modal
      // console.log("SET NO CONTRACTORS FOUND MODAL");
    }

    // this.setState({ isOpen: true });
  }

  serviceCardClickHandler = serviceId => {
    var service = this.state.services.filter(service => {
      return service.serviceId === serviceId
    });

    if (this.props.isAuth) {
      if (service[0].hasContractors) {
        window.location.href = "/services/" + service[0].serviceId;
      }
      else {
        this.setModal(1);
      }
    }
    else {
      this.setModal(0);
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
            <div className="search-container">
              <TextField
                type="search"
                name="search"
                label="Search"
                value={this.state.searchContent}
                onChange={this.searchChange}
                variant="outlined"
                style={{ width: "100%" }}
              />
            </div>
            <div className="services">
              {this.state.filteredServices.map(service => (
                <Card
                  className="service"
                  variant="outlined"
                  key={service.serviceId}
                  onClick={() => this.serviceCardClickHandler(service.serviceId)}
                >
                  <h2 className="service-title">
                    {service.serviceName.toUpperCase()}
                  </h2>
                </Card>
              ))}
              {this.state.filteredServices.length === 0 && (
                <h2 style={{ margin: "20px auto 0", color: "#a5a5a5" }}>No services match</h2>
              )}
            </div>
          </Auxil>
        ) : <Backdrop />}


        <Dialog
          open={this.state.isOpen}
          onClose={this.handleClose}
        >
          <DialogTitle>Title here</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Content text here
            </DialogContentText>
          </DialogContent>
        </Dialog>


        {/* <Dialog
          open={this.state.isOpen}
          onClose={this.handleClose}
        >
          <DialogTitle style={{ background: "#fbfbfb" }}>Please login to continue</DialogTitle>
          <DialogContent style={{ background: "#fbfbfb" }}>
            <DialogContentText style={{ textAlign: "center" }}>
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
        </Dialog> */}
      </div>
    );
  }
}

export default ServicesPage;
