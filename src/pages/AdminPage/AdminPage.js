import React, { Component } from "react";
import "./AdminPage.css";
import Title from "../../components/UI/Title/Title";
import Backdrop from "../../components/UI/Backdrop/Backdrop";
import Aux from "../../helpers/Aux";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { AuthService } from "../../services/auth";
import { AccountService } from "../../services/account";

// How to style MatUI text fields: https://stackoverflow.com/questions/46966413/how-to-style-material-ui-textfield

class AdminPage extends Component {
  state = {
    userType: AuthService.getRole(),
    adminDetails: {
      email: "",
      firstName: "",
      lastName: "",
      phone: "",
      addressId: "",
      address: "",
      city: "",
      postalCode: "",
      province: "",
      bio: "",
      photo: "",
      linkedin: "",
      facebook: "",
      youtube: "",
      instagram: "",
      website: "",
      services: null
    },
    hasEditedDetails: false,
    isLoading: false
  };

  componentDidMount() {
    // this.setState({ isLoading: true });
    // AccountService.getAccountDetails()
    //   .then(res => {
    //     this.setState({ accountDetails: res.data, isLoading: false });
    //   })
    //   .catch(error => {
    //     this.displayMessage(
    //       "Error while getting account details: " + error.response,
    //       false
    //     );
    //   });
  }

  //   // Displays feedback to user
  //   displayMessage(message, success) {
  //     if (success) {
  //       alert("Success: " + message);
  //     } else {
  //       alert("Failure: " + message);
  //     }
  //   }

  //   saveChangesClickHandler = () => {
  //     this.setState({ isLoading: true });
  //     AccountService.setAccountDetails(this.state.accountDetails)
  //       .then(res => {
  //         this.setState({ isLoading: false });
  //       })
  //       .catch(error => {
  //         this.displayMessage(
  //           "Error while updating account details: " + error.response,
  //           false
  //         );
  //         this.setState({ isLoading: false });
  //       });
  //     this.setState({
  //       hasEditedDetails: false
  //     });
  //   };

  //   accountDetailsChange = event => {
  //     const newAccountDetails = Object.assign(this.state.accountDetails, {
  //       [event.target.name]: event.target.value
  //     });
  //     this.setState({
  //       accountDetails: newAccountDetails,
  //       hasEditedDetails: true
  //     });
  //   };

  render() {
    return (
      <div className="admin-page-container">
        <Aux>
          <Title>ADMIN PANEL</Title>
        </Aux>
      </div>
    );
  }
}

export default AdminPage;
