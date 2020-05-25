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
import { AuthService } from "../../services/auth";

class ServiceDetailsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      serviceDetails: null,
      userType: AuthService.getRole(),
      showAddJobForm: false,
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
        this.displayMessage(
          "Error while getting account details: " + error.response,
          false
        );
      });
  };

  renderContent() {
    return (
      <Aux>
        <Title>{this.state.serviceDetails.serviceName.toUpperCase()}</Title>
        {this.state.userType === 0 && !this.state.showAddJobForm ? (
          <Button onClick={this.addJobClickHandler}>ADD JOB</Button>
        ) : null}
        {this.state.showAddJobForm ? (
          <form>
            <Button>SEND REQUEST</Button>
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
