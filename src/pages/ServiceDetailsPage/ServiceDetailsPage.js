import React, { Component } from "react";
import Card from "@material-ui/core/Card";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import Aux from "../../helpers/Aux";
import Backdrop from "../../components/UI/Backdrop/Backdrop";
import Title from "../../components/UI/Title/Title";
import "./ServiceDetailsPage.css";

import { ServicesService } from "../../services/service";
import { AccountService } from "../../services/account";
import { JobService } from "../../services/jobs";
import { AuthService } from "../../services/auth";

class ServiceDetailsPage extends Component {
  provinces = [
    {
      value: "ON",
      label: "Ontario"
    }
  ];

  constructor(props) {
    super(props);
    this.state = {
      serviceDetails: null,
      accountDetails: null,
      jobDetails: {
        serviceId: this.props.match.params.id,
        budget: null,
        description: null,
        address: null,
        city: null,
        postalCode: null,
        province: null
      },
      userType: AuthService.getRole(),
      hasEditedDetails: false,
      isLoading: false
    };
  }

  componentDidMount() {
    this.setState({ isLoading: true });

    ServicesService.getServiceDetails(this.props.match.params.id)
      .then(res => {
        this.setState({ serviceDetails: res.data });

        AccountService.getAccountDetails()
          .then(res => {
            console.log(this.state.jobDetails);

            var jobDetailsCopy = this.state.jobDetails;

            jobDetailsCopy.address = res.data.address;
            jobDetailsCopy.city = res.data.city;
            jobDetailsCopy.province = res.data.province;
            jobDetailsCopy.postalCode = res.data.postalCode;

            this.setState({
              accountDetails: res.data,
              jobDetails: jobDetailsCopy,
              isLoading: false
            });
          })
          .catch(error => {
            alert(
              "Error while getting account details: " + error.response,
              false
            );
          });
      })
      .catch(err => {
        console.error("Error while getting service details" + err.response);
      });
  }

  jobDetailsChange = event => {
    const newJobDetails = Object.assign(this.state.jobDetails, {
      [event.target.name]: event.target.value
    });
    this.setState({
      jobDetails: newJobDetails,
      hasEditedDetails: true
    });
  };

  submitJobClickHandler = () => {
    this.setState({ isLoading: true });

    JobService.addJob(this.state.jobDetails)
      .then(res => {
        this.setState({ isLoading: false });
      })
      .catch(error => {
        this.displayMessage("Error while adding job: " + error.response, false);
        this.setState({ isLoading: false });
      });

    this.setState({
      hasEditedDetails: false
    });
  };

  renderContent() {
    return (
      <Aux>
        <Title>{this.state.serviceDetails.serviceName.toUpperCase()}</Title>
        {this.state.userType === 0 ? (
          <div className="textfield-container">
            <h2 className="form-title">DESCRIPTION</h2>
            <p>{this.state.serviceDetails.description}</p>
            <div className="textfield-container-row">
              <TextField
                type="text"
                name="budget"
                label="budget"
                value={this.state.jobDetails.budget || ""}
                variant="outlined"
                onChange={this.jobDetailsChange}
              />
            </div>
            <div className="textfield-container-row">
              <TextField
                type="text"
                name="description"
                label="description"
                value={this.state.jobDetails.description || ""}
                variant="outlined"
                onChange={this.jobDetailsChange}
              />
            </div>
            <div className="textfield-container-row">
              <TextField
                type="text"
                name="address"
                label="address"
                value={this.state.jobDetails.address || ""}
                variant="outlined"
                onChange={this.jobDetailsChange}
              />
            </div>
            <div className="textfield-container-row">
              <TextField
                type="text"
                name="city"
                label="city"
                value={this.state.jobDetails.city || ""}
                variant="outlined"
                onChange={this.jobDetailsChange}
              />
            </div>
            <div className="textfield-container-row">
              <TextField
                type="text"
                name="postalCode"
                label="postal code"
                value={this.state.jobDetails.postalCode || ""}
                variant="outlined"
                onChange={this.jobDetailsChange}
              />
            </div>
            <div className="textfield-container-row">
              <TextField
                select
                name="province"
                label="province"
                value={this.state.jobDetails.province || ""}
                onChange={this.jobDetailsChange}
                variant="outlined"
              >
                {this.provinces.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </div>
            <Button
              onClick={this.submitJobClickHandler}
              variant="contained"
              color="primary"
            >
              GET A QUOTE
            </Button>
          </div>
        ) : null}
      </Aux>
    );
  }

  render() {
    return (
      <div className="service-details-page-container">
        {this.state.serviceDetails &&
          this.state.accountDetails &&
          this.renderContent()}
        {this.state.isLoading ? <Backdrop /> : null}
      </div>
    );
  }
}

export default ServiceDetailsPage;
