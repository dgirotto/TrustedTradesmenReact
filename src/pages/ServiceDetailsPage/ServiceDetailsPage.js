import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import Auxil from "../../helpers/Auxil";
import Backdrop from "../../components/UI/Backdrop/Backdrop";
import Title from "../../components/UI/Title/Title";
import "./ServiceDetailsPage.css";

import { ServicesService } from "../../services/service";
import { AccountService } from "../../services/account";
import { JobService } from "../../services/jobs";
import { AuthService } from "../../services/auth";

class ServiceDetailsPage extends Component {
  budgets = [
    {
      value: "Under $1,000"
    },
    {
      value: "$1,000 - $2,000"
    },
    {
      value: "$2,000 - $4,000"
    },
    {
      value: "$4,000 - $10,000"
    },
    {
      value: "Over $10,000"
    }
  ];

  timeFrames = [
    {
      value: 1,
      label: "1 Month"
    },
    {
      value: 2,
      label: "2 Months"
    },
    {
      value: 3,
      label: "3 Months"
    },
    {
      value: 6,
      label: "6 Months"
    },
    {
      value: 12,
      label: "1 Year"
    }
  ];

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
            var jobDetailsCopy = this.state.jobDetails;

            jobDetailsCopy.address = res.data.address;
            jobDetailsCopy.city = res.data.city;
            jobDetailsCopy.province = res.data.province;
            jobDetailsCopy.postalCode = res.data.postalCode;

            this.setState({
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
      jobDetails: newJobDetails
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
  };

  renderContent() {
    return (
      <Auxil>
        <Title>{this.state.serviceDetails.serviceName.toUpperCase()} SERVICES</Title>
        <h2 className="form-title">DESCRIPTION</h2>
        <p>{this.state.serviceDetails.description}</p>
        {this.state.userType === 0 ? (
          <div className="textfield-container">
            <br />
            <p style={{ fontStyle: "italic" }}>Interested in hiring a <b>{this.state.serviceDetails.serviceName}</b> contractor? Fill out the form below and submit a request.</p>
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
                select
                name="budget"
                label="budget"
                value={this.state.jobDetails.budget || ""}
                onChange={this.jobDetailsChange}
                variant="outlined"
              >
                {this.budgets.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.value}
                  </MenuItem>
                ))}
              </TextField>
            </div>
            <div className="textfield-container-row">
              <TextField
                select
                name="timeFrame"
                label="time frame"
                value={this.state.jobDetails.timeFrame || ""}
                onChange={this.jobDetailsChange}
                variant="outlined"
              >
                {this.timeFrames.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
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
              disabled={
                !(
                  this.state.jobDetails.budget &&
                  this.state.jobDetails.description &&
                  this.state.jobDetails.address &&
                  this.state.jobDetails.city &&
                  this.state.jobDetails.postalCode &&
                  this.state.jobDetails.province
                )
              }
            >
              SUBMIT REQUEST
            </Button>
          </div>
        ) : null}
      </Auxil>
    );
  }

  render() {
    return (
      <div className="service-details-page-container">
        {this.state.serviceDetails &&
          this.renderContent()}
        {this.state.isLoading ? <Backdrop /> : null}
      </div>
    );
  }
}

export default ServiceDetailsPage;
