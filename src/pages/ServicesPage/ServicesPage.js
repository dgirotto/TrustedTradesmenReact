import React, { Component } from "react";
import Card from "@material-ui/core/Card";
import Backdrop from "../../components/UI/Backdrop/Backdrop";
import Title from "../../components/UI/Title/Title";
import ResponsiveDialog from "../../components/ResponsiveDialog";
import Button from '@material-ui/core/Button';
import TextField from "@material-ui/core/TextField";

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
      modalContent: {
        title: null,
        content: null
      }
    };
  }

  componentDidMount() {
    this.setState({ isLoading: true });

    ServicesService.getServices()
      .then(res => {
        // Tokenize search terms
        res.data.forEach(service => {
          service.searchTerms = service.searchTerms.split(';');
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
    var searchTokens = null;

    if (event.target.value.trim() === "") {
      filteredServicesNew = this.state.services;
    }
    else {
      searchTokens = event.target.value.trim().toLowerCase().split(' ');
      // Filter services on search terms
      this.state.services.forEach(service => {
        if (service.searchTerms.filter(s => searchTokens.some(p => s.includes(p))).length > 0) {
          filteredServicesNew.push(service);
        }
      });
    }

    this.setState({
      filteredServices: filteredServicesNew,
      searchContent: event.target.value
    });
  }

  // setModal = modalType => {
  //   if (modalType === 0) {
  //     // Must log in modal
  //     this.setState({
  //       modalContent: {
  //         title: 'Login Required',
  //         content: <>
  //           <span style={{ display: "block", margin: "10px 0" }}>You'll need to login to be able to submit a job request.</span>
  //           <Button
  //             onClick={() => (window.location.href = "/login")}
  //             variant="contained"
  //             color="primary"
  //             style={{ background: "#282828", borderRadius: "0" }}
  //           >
  //             LOGIN
  //           </Button>
  //           <span style={{ display: "block", margin: "20px 0 10px" }}>Don't have an account?</span>
  //           <Button
  //             onClick={() => (window.location.href = "/register")}
  //             variant="contained"
  //             color="primary"
  //             style={{ background: "#282828", borderRadius: "0" }}
  //           >
  //             REGISTER
  //           </Button>
  //         </>,
  //         actions: <>
  //           <Button onClick={this.handleClose}>
  //             CLOSE
  //           </Button>
  //         </>
  //       }
  //     });
  //   }
  //   else if (modalType === 1) {
  //     // No contractors found modal
  //     this.setState({
  //       modalContent: {
  //         title: 'No Contractors Available',
  //         content: <>
  //           Sorry, but there aren't any contractors currently available for that service. Please check back soon!
  //         </>,
  //         actions: <>
  //           <Button onClick={this.handleClose}>
  //             OK
  //           </Button>
  //         </>
  //       }
  //     });
  //   }
  //   else {
  //     // Need a customer account to submit job request
  //     this.setState({
  //       modalContent: {
  //         title: 'Invalid Account Type',
  //         content: <>
  //           You need to be logged in as a customer to submit a job request.
  //         </>,
  //         actions: <>
  //           <Button onClick={this.handleClose}>
  //             OK
  //           </Button>
  //         </>
  //       }
  //     });
  //   }

  //   this.setState({ isOpen: true });
  // }

  serviceCardClickHandler = serviceId => {
    var service = this.state.services.filter(service => {
      return service.serviceId === serviceId
    });

    if (this.props.isAuth) {
      if (this.props.userType !== 0) {
        // this.setModal(2);
      }
      // else if (!service[0].hasContractors) {
      //   this.setModal(1);
      // }
      else {
        window.location.href = "/services/" + service[0].serviceId;
      }
    }
    else {
      this.props.handleOpen(false);
    }
  };

  render() {
    return (
      <div className="page-container">
        {!this.state.isLoading && this.state.services ? (
          <>
            <Title>Our Services</Title>
            <div className="search-container">
              <TextField
                type="search"
                name="search"
                label="Search Services"
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
                <h2 style={{ margin: "20px auto 0", color: "#a5a5a5" }}>Try a different search</h2>
              )}
            </div>
          </>
        ) : <Backdrop />}

        {/* <ResponsiveDialog
          isOpen={this.state.isOpen}
          modalContent={this.state.modalContent}
          handleClose={this.handleClose}
        /> */}
      </div>
    );
  }
}

export default ServicesPage;
