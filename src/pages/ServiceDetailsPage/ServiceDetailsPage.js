import React, { Component } from "react";
import Card from "@material-ui/core/Card";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Aux from "../../helpers/Aux";
import Backdrop from "../../components/UI/Backdrop/Backdrop";
import Title from "../../components/UI/Title/Title";
import "./ServiceDetailsPage.css";

import { ServicesService } from "../../services/service";
import { AccountService } from "../../services/account";
import { JobService } from "../../services/jobs";
import { AuthService } from "../../services/auth";

class ServiceDetailsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      serviceDetails: null,
      accountDetails: null,
      jobDetails: {
        serviceId: this.props.match.params.id,
        budget: null,
        description: null
      },
      userType: AuthService.getRole(),
      showAddJobForm: false,
      hasEditedDetails: false,
      isLoading: false
    };
  }

  componentDidMount() {
    this.setState({ isLoading: true });

    ServicesService.getServiceDetails(this.props.match.params.id)
      .then(res => {
        this.setState({ serviceDetails: res.data, isLoading: false });
      })
      .catch(err => {
        console.error("Error while getting service details" + err.response);
      });
  }

  accountDetailsChange = event => {
    const newAccountDetails = Object.assign(this.state.accountDetails, {
      [event.target.name]: event.target.value
    });
    this.setState({
      accountDetails: newAccountDetails,
      hasEditedDetails: true
    });
  };

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
    // this.setState({ isLoading: true });
    // JobService.addJob(this.state.jobDetails);
  };

  addJobClickHandler = () => {
    this.setState({ isLoading: true });

    AccountService.getAccountDetails()
      .then(res => {
        this.setState({
          accountDetails: res.data,
          showAddJobForm: true,
          isLoading: false
        });
      })
      .catch(error => {
        // this.displayMessage(
        //   "Error while getting account details: " + error.response,
        //   false
        // );
      });
  };

  renderContent() {
    return (
      <Aux>
        <Title>{this.state.serviceDetails.serviceName.toUpperCase()}</Title>
        <h2 className="form-title">DESCRIPTION</h2>
        <p>{this.state.serviceDetails.description}</p>
        {this.state.userType === 0 && !this.state.showAddJobForm ? (
          <Button
            onClick={this.addJobClickHandler}
            variant="contained"
            color="primary"
          >
            ADD JOB
          </Button>
        ) : null}
        {this.state.showAddJobForm ? (
          <form>
            <div className="textfield-container-row">
              <div>
                <TextField
                  type="text"
                  name="budget"
                  label="budget"
                  value={this.state.jobDetails.budget || ""}
                  variant="outlined"
                  onChange={this.jobDetailsChange}
                />
              </div>
            </div>
            <div className="textfield-container-row">
              <div>
                <TextField
                  type="text"
                  name="description"
                  label="description"
                  value={this.state.jobDetails.description || ""}
                  variant="outlined"
                  onChange={this.jobDetailsChange}
                />
              </div>
            </div>
            <div className="textfield-container-row">
              <div>
                <TextField
                  type="text"
                  name="address"
                  label="address"
                  value={this.state.accountDetails.address || ""}
                  variant="outlined"
                  onChange={this.accountDetailsChange}
                />
              </div>
            </div>
            <div className="textfield-container-row">
              <div>
                <TextField
                  type="text"
                  name="city"
                  label="city"
                  value={this.state.accountDetails.city || ""}
                  variant="outlined"
                  onChange={this.accountDetailsChange}
                />
              </div>
            </div>
            <div className="textfield-container-row">
              <div>
                <TextField
                  type="text"
                  name="postalCode"
                  label="postal code"
                  value={this.state.accountDetails.postalCode || ""}
                  variant="outlined"
                  onChange={this.accountDetailsChange}
                />
              </div>
            </div>
            <div className="textfield-container-row">
              <div>
                <TextField
                  type="text"
                  name="province"
                  label="province"
                  value={this.state.accountDetails.province || ""}
                  variant="outlined"
                  onChange={this.accountDetailsChange}
                />
              </div>
            </div>
            <Button
              onClick={this.submitJobClickHandler}
              variant="contained"
              color="primary"
            >
              SUBMIT JOB
            </Button>
          </form>
        ) : null}
      </Aux>
    );
  }

  render() {
    return (
      <div className="service-details-page-container">
        {this.state.serviceDetails && this.renderContent()}
        {this.state.isLoading ? <Backdrop /> : null}
      </div>
    );
  }
}

export default ServiceDetailsPage;
