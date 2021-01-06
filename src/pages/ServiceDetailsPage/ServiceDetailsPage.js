import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

import Auxil from "../../helpers/Auxil";
import Backdrop from "../../components/UI/Backdrop/Backdrop";
import Title from "../../components/UI/Title/Title";
import "./ServiceDetailsPage.css";

import { ServicesService } from "../../services/service";
import { AccountService } from "../../services/account";
import { JobService } from "../../services/jobs";
import { AuthService } from "../../services/auth";

function AlertPopup(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

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
      accountDetails: null,
      jobDetails: {
        serviceId: this.props.match.params.id
      },
      updateContactDetails: false,
      userType: AuthService.getRole(),
      isLoading: true,
      showSnackbar: false,
      isError: false,
      message: ""
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

            jobDetailsCopy.firstName = res.data.firstName;
            jobDetailsCopy.lastName = res.data.lastName;
            jobDetailsCopy.phone = res.data.phone;
            jobDetailsCopy.address = res.data.address;
            jobDetailsCopy.city = res.data.city;
            jobDetailsCopy.province = res.data.province;
            jobDetailsCopy.postalCode = res.data.postalCode;

            var accountDetails = {
              firstName: res.data.firstName,
              lastName: res.data.lastName,
              phone: res.data.phone
            };

            this.setState({
              jobDetails: jobDetailsCopy,
              accountDetails: accountDetails,
              updateContactDetails: !(res.data.firstName && res.data.lastName && res.data.phone),
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

    if (this.state.updateContactDetails) {
      AccountService.setAccountDetails(
        {
          firstName: this.state.jobDetails.firstName,
          lastName: this.state.jobDetails.lastName,
          phone: this.state.jobDetails.phone
        }
      )
        .catch(error => {
          this.displayMessage("Error while updating account details: " + error.response + "; Job not submitted.", false);
          this.setState({ isLoading: false });
          return;
        });
    }

    JobService.addJob(this.state.jobDetails)
      .then(res => {
        var cleanJobDetails = this.state.jobDetails;
        cleanJobDetails.description = null;
        cleanJobDetails.budget = null;
        cleanJobDetails.timeFrame = null;

        var updatedAccountDetails = {
          firstName: this.state.jobDetails.firstName,
          lastName: this.state.jobDetails.lastName,
          phone: this.state.jobDetails.phone
        };

        this.setState({
          accountDetails: updatedAccountDetails,
          jobDetails: cleanJobDetails,
          isLoading: false,
          showSnackbar: true,
          isError: false,
          message: res.data.message
        });
      })
      .catch(error => {
        this.displayMessage("Error while adding job: " + error.response, false);
        this.setState({
          isLoading: false,
          showSnackbar: true,
          isError: true,
          message: error.response.data.message
        });
      });
  };

  toggleSnackbar = () => {
    this.setState({ showSnackbar: !this.state.showSnackbar });
  };

  renderContent() {
    return (
      <Auxil>
        <Title>{this.state.serviceDetails.serviceName.toUpperCase()} SERVICES</Title>
        <h2 className="form-title">DESCRIPTION</h2>
        <p>{this.state.serviceDetails.description}</p>
        {this.state.userType === 0 && (
          <Auxil>
            <p style={{ marginTop: "50px" }}>Interested in hiring a <b>{this.state.serviceDetails.serviceName}</b> contractor? Fill out the form below and submit a request.</p>
            <div className="textfield-container-col">
              <TextField
                type="text"
                name="description"
                label="Description"
                value={this.state.jobDetails.description || ""}
                variant="outlined"
                onChange={this.jobDetailsChange}
              />
            </div>
            <div className="textfield-container-row">
              <div className="textfield-container-col">
                <TextField
                  select
                  name="budget"
                  label="Budget"
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
              <div className="textfield-container-col">
                <TextField
                  select
                  name="timeFrame"
                  label="Time Frame"
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
            </div>
            <div className="textfield-container-row">
              <div className="textfield-container-col">
                <TextField
                  type="text"
                  name="firstName"
                  label="First Name"
                  value={this.state.jobDetails.firstName || ""}
                  variant="outlined"
                  onChange={this.jobDetailsChange}
                  disabled={this.state.accountDetails.firstName}
                />
              </div>
              <div className="textfield-container-col">
                <TextField
                  type="text"
                  name="lastName"
                  label="Last Name"
                  value={this.state.jobDetails.lastName || ""}
                  variant="outlined"
                  onChange={this.jobDetailsChange}
                  disabled={this.state.accountDetails.lastName}
                />
              </div>
              <div className="textfield-container-col">
                <TextField
                  type="text"
                  name="phone"
                  label="Phone"
                  value={this.state.jobDetails.phone || ""}
                  variant="outlined"
                  onChange={this.jobDetailsChange}
                  disabled={this.state.accountDetails.phone}
                />
              </div>
            </div>
            <div className="textfield-container-col">
              <TextField
                type="text"
                name="address"
                label="Address"
                value={this.state.jobDetails.address || ""}
                variant="outlined"
                onChange={this.jobDetailsChange}
              />
            </div>
            <div className="textfield-container-row">
              <div className="textfield-container-col">
                <TextField
                  type="text"
                  name="city"
                  label="City"
                  value={this.state.jobDetails.city || ""}
                  variant="outlined"
                  onChange={this.jobDetailsChange}
                />
              </div>
              <div className="textfield-container-col">
                <TextField
                  type="text"
                  name="postalCode"
                  label="Postal Code"
                  value={this.state.jobDetails.postalCode || ""}
                  variant="outlined"
                  onChange={this.jobDetailsChange}
                />
              </div>
              <div className="textfield-container-col">
                <TextField
                  select
                  name="province"
                  label="Province"
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
            </div>
            <span style={{ display: "block", padding: "0 0 15px", fontStyle: "italic", color: "red" }}>
              All fields are required. Account details can be updated <a href="/settings" target="_blank">here</a>.
            </span>
            <Button
              onClick={this.submitJobClickHandler}
              variant="contained"
              color="primary"
              disabled={
                !(
                  this.state.jobDetails.description &&
                  this.state.jobDetails.budget &&
                  this.state.jobDetails.timeFrame &&
                  this.state.jobDetails.firstName &&
                  this.state.jobDetails.lastName &&
                  this.state.jobDetails.phone &&
                  this.state.jobDetails.address &&
                  this.state.jobDetails.city &&
                  this.state.jobDetails.postalCode &&
                  this.state.jobDetails.province
                )
              }
            >
              SUBMIT REQUEST
            </Button>
          </Auxil>
        )}
      </Auxil>
    );
  }

  render() {
    return (
      <div className="page-container">
        {this.state.isLoading ? <Backdrop /> : this.renderContent()}

        <Snackbar
          open={this.state.showSnackbar}
          autoHideDuration={5000}
          onClose={this.toggleSnackbar}
        >
          <AlertPopup onClose={this.toggleSnackbar} severity={this.state.isError ? "error" : "success"}>
            {this.state.message}
          </AlertPopup>
        </Snackbar>
      </div>
    );
  }
}

export default ServiceDetailsPage;
