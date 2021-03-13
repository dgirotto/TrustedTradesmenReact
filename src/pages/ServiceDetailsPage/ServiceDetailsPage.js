import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Backdrop from "../../components/UI/Backdrop/Backdrop";
import Title from "../../components/UI/Title/Title";
import "./ServiceDetailsPage.css";

import { ServicesService } from "../../services/service";
import { AccountService } from "../../services/account";
import { JobService } from "../../services/jobs";
import { AuthService } from "../../services/auth";
import { formatTimeFrame, formatBudget } from '../../helpers/Utils';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';

function AlertPopup(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class ServiceDetailsPage extends Component {
  budgets = [1, 2, 3, 4, 5];
  timeFrames = [-1, 1, 4, 8, 12, 24, 48];
  provinces = [{ value: "ON", label: "Ontario" }];

  constructor(props) {
    super(props);
    this.state = {
      serviceDetails: null,
      accountDetails: null,
      jobDetails: {
        serviceId: this.props.match.params.id
      },
      setPrimaryAddress: true,
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

    var jobDetailsToSend = this.state.jobDetails;
    jobDetailsToSend.setPrimaryAddress = this.state.setPrimaryAddress;

    JobService.addJob(jobDetailsToSend)
      .then(() => {
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
          message: "Job submitted successfully. Please allow 24 hours for contractor response."
        });
      })
      .catch(() => {
        this.setState({
          isLoading: false,
          showSnackbar: true,
          isError: true,
          message: "Could not submit job request"
        });
      });
  };

  toggleSnackbar = () => {
    this.setState({ showSnackbar: !this.state.showSnackbar });
  };

  renderContent() {
    return (
      <>
        <Title>{this.state.serviceDetails.serviceName} Request</Title>
        <Button
          style={{ fontWeight: "bold", background: "#2f2f2f", color: "white", marginBottom: "10px" }}
          onClick={() => { window.location.href = "/services" }}
        >
          <ArrowBackIcon style={{ fontSize: "medium" }} /> SERVICES
        </Button>
        {/* <div style={{ margin: "35px 0" }}>
          <h2 className="form-title">DESCRIPTION</h2>
          <p>{this.state.serviceDetails.description}</p>
        </div> */}
        {this.state.userType === 0 && (
          <>
            <p style={{ marginBottom: "35px" }}>Are you interested in hiring a <b>{this.state.serviceDetails.serviceName}</b> contractor? Fill out the form below and submit a request.</p>
            <span className="field-desc">Provide a general description for job required (square footage, material type, etc.)</span>
            <div className="textfield-container-col">
              <TextField
                type="text"
                name="description"
                label="Description"
                variant="outlined"
                required
                value={this.state.jobDetails.description || ""}
                onChange={this.jobDetailsChange}
              />
            </div>
            <div className="textfield-container-row">
              <div className="textfield-container-col">
                <TextField
                  select
                  name="budget"
                  label="Budget"
                  variant="outlined"
                  required
                  value={this.state.jobDetails.budget || ""}
                  onChange={this.jobDetailsChange}
                >
                  {this.budgets.map(option => (
                    <MenuItem key={option} value={option}>
                      {formatBudget(option)}
                    </MenuItem>
                  ))}
                </TextField>
              </div>
              <div className="textfield-container-col">
                <TextField
                  select
                  name="timeFrame"
                  label="Time Frame"
                  variant="outlined"
                  required
                  value={this.state.jobDetails.timeFrame || ""}
                  onChange={this.jobDetailsChange}
                >
                  {this.timeFrames.map(option => (
                    <MenuItem key={option} value={option}>
                      {formatTimeFrame(option)}
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
                  variant="outlined"
                  required
                  value={this.state.jobDetails.firstName || ""}
                  onChange={this.jobDetailsChange}
                />
              </div>
              <div className="textfield-container-col">
                <TextField
                  type="text"
                  name="lastName"
                  label="Last Name"
                  variant="outlined"
                  required
                  value={this.state.jobDetails.lastName || ""}
                  onChange={this.jobDetailsChange}
                />
              </div>
              <div className="textfield-container-col">
                <TextField
                  type="text"
                  name="phone"
                  label="Phone"
                  variant="outlined"
                  required
                  value={this.state.jobDetails.phone || ""}
                  onChange={this.jobDetailsChange}
                />
              </div>
            </div>
            <div className="textfield-container-col">
              <TextField
                type="text"
                name="address"
                label="Address"
                variant="outlined"
                required
                value={this.state.jobDetails.address || ""}
                onChange={this.jobDetailsChange}
              />
            </div>
            <div className="textfield-container-row">
              <div className="textfield-container-col">
                <TextField
                  type="text"
                  name="city"
                  label="City"
                  variant="outlined"
                  required
                  value={this.state.jobDetails.city || ""}
                  onChange={this.jobDetailsChange}
                />
              </div>
              <div className="textfield-container-col">
                <TextField
                  select
                  name="province"
                  label="Province"
                  variant="outlined"
                  required
                  value={this.state.jobDetails.province || ""}
                  onChange={this.jobDetailsChange}
                >
                  {this.provinces.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </div>
              <div className="textfield-container-col">
                <TextField
                  type="text"
                  name="postalCode"
                  label="Postal Code"
                  variant="outlined"
                  required
                  value={this.state.jobDetails.postalCode || ""}
                  onChange={this.jobDetailsChange}
                />
              </div>
            </div>
            <div style={{ margin: "-10px 0 10px" }}>
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={event => {
                      if (event.target.checked) {
                        this.setState({ setPrimaryAddress: true });
                      }
                      else {
                        this.setState({ setPrimaryAddress: false });
                      }
                    }}
                    checked={this.state.setPrimaryAddress}
                  />
                }
                label="Use this as my primary address"
              />
            </div>
            <Button
              style={{ fontWeight: "bold" }}
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
          </>
        )}
      </>
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
