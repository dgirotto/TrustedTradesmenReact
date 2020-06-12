import React, { Component } from "react";
import "./SettingsPage.css";
import Backdrop from "../../components/UI/Backdrop/Backdrop";
import Aux from "../../helpers/Aux";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

import { AuthService } from "../../services/auth";
import { AccountService } from "../../services/account";
import { ServicesService } from "../../services/service";

// How to style MatUI text fields: https://stackoverflow.com/questions/46966413/how-to-style-material-ui-textfield

class SettingsPage extends Component {
  provinces = [
    {
      value: "ON",
      label: "Ontario"
    }
  ];

  state = {
    userType: AuthService.getRole(),
    accountDetails: {
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
    passwordDetails: {
      password: "",
      newPassword: "",
      confirmNewPassword: ""
    },
    services: [],
    hasEditedDetails: false,
    isLoading: false
  };

  componentDidMount() {
    this.setState({ isLoading: true });

    AccountService.getAccountDetails()
      .then(res => {
        res.data.services = res.data.services.split(",");
        this.setState({ accountDetails: res.data });
      })
      .catch(error => {
        this.displayMessage(
          "Error while getting account details: " + error.response,
          false
        );
      })
      .then(() => {
        console.log(this.state.accountDetails);
        if (this.state.userType === 1) {
          ServicesService.getServices(true)
            .then(res => {
              this.setState({ services: res.data, isLoading: false });
            })
            .catch(error => {
              this.displayMessage(
                "Error while getting service list: " + error.response,
                false
              );
            });
        } else {
          this.setState({ isLoading: false });
        }
      });
  }

  // Displays feedback to user
  displayMessage(message, success) {
    if (success) {
      alert("Success: " + message);
    } else {
      alert("Failure: " + message);
    }
  }

  saveChangesClickHandler = () => {
    this.setState({ isLoading: true });

    AccountService.setAccountDetails(this.state.accountDetails)
      .then(res => {
        this.setState({ isLoading: false });
      })
      .catch(error => {
        this.displayMessage(
          "Error while updating account details: " + error.response,
          false
        );
        this.setState({ isLoading: false });
      });

    this.setState({
      hasEditedDetails: false
    });
  };

  changePasswordClickHandler = () => {
    if (
      this.state.passwordDetails.newPassword !==
      this.state.passwordDetails.confirmNewPassword
    ) {
      this.displayMessage("New passwords don't match!", false);
      return;
    }
    this.setState({ isLoading: true });

    AccountService.changePassword({
      password: this.state.passwordDetails.password,
      newPassword: this.state.passwordDetails.newPassword
    })
      .then(res => {
        this.setState({
          isLoading: false,
          passwordDetails: {
            password: "",
            newPassword: "",
            confirmNewPassword: ""
          }
        });
      })
      .catch(error => {
        this.displayMessage(
          "Error when trying to change password: " + error.response,
          false
        );
        this.setState({ isLoading: false });
      });
  };

  accountDetailsChange = event => {
    console.log(this.state.accountDetails.services);
    const newAccountDetails = Object.assign(this.state.accountDetails, {
      [event.target.name]: event.target.value
    });
    this.setState({
      accountDetails: newAccountDetails,
      hasEditedDetails: true
    });
  };

  passwordChange = event => {
    const newPasswordDetails = Object.assign(this.state.passwordDetails, {
      [event.target.name]: event.target.value
    });
    this.setState({
      passwordDetails: newPasswordDetails
    });
  };

  render() {
    return (
      <Aux>
        <div className="account-details-container">
          <div className="textfield-container">
            <form>
              <h2 className="form-title">CONTACT DETAILS</h2>
              <div className="textfield-container-row">
                <TextField
                  type="text"
                  name="firstName"
                  label="first name"
                  value={this.state.accountDetails.firstName || ""}
                  variant="outlined"
                  onChange={this.accountDetailsChange}
                />
              </div>
              <div className="textfield-container-row">
                <TextField
                  type="text"
                  name="lastName"
                  label="last name"
                  value={this.state.accountDetails.lastName || ""}
                  variant="outlined"
                  onChange={this.accountDetailsChange}
                />
              </div>
              <div className="textfield-container-row">
                <TextField
                  type="text"
                  name="phone"
                  label="phone"
                  value={this.state.accountDetails.phone || ""}
                  variant="outlined"
                  onChange={this.accountDetailsChange}
                />
              </div>
              <h2 className="form-title">ADDRESS DETAILS</h2>
              <div className="textfield-container-row">
                <TextField
                  type="text"
                  name="address"
                  label="address"
                  value={this.state.accountDetails.address || ""}
                  variant="outlined"
                  onChange={this.accountDetailsChange}
                />
              </div>
              <div className="textfield-container-row">
                <TextField
                  type="text"
                  name="city"
                  label="city"
                  value={this.state.accountDetails.city || ""}
                  variant="outlined"
                  onChange={this.accountDetailsChange}
                />
              </div>
              <div className="textfield-container-row">
                <TextField
                  type="text"
                  name="postalCode"
                  label="postal code"
                  value={this.state.accountDetails.postalCode || ""}
                  variant="outlined"
                  onChange={this.accountDetailsChange}
                />
              </div>
              <div className="textfield-container-row">
                <TextField
                  select
                  name="province"
                  label="province"
                  value={this.state.accountDetails.province || ""}
                  onChange={this.accountDetailsChange}
                  variant="outlined"
                >
                  {this.provinces.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </div>
              {this.state.userType === 1 ? (
                <Aux>
                  <h2 className="form-title">CONTRACTOR DETAILS</h2>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">Services Offered:</FormLabel>
                    <FormGroup>
                      {this.state.services.map(service => (
                        <FormControlLabel
                          control={
                            <Checkbox
                              onChange={this.accountDetailsChange}
                              name={service.serviceName}
                              checked={this.state.accountDetails.services.includes(
                                service.serviceId
                              )}
                            />
                          }
                          label={service.serviceName}
                          key={service.serviceId}
                        />
                      ))}
                    </FormGroup>
                  </FormControl>
                  <div className="textfield-container-row">
                    <TextField
                      multiline
                      rowsMax={6}
                      type="text"
                      name="bio"
                      label="bio"
                      value={this.state.accountDetails.bio || ""}
                      variant="outlined"
                      onChange={this.accountDetailsChange}
                    />
                  </div>
                  <div className="textfield-container-row">
                    <TextField
                      type="text"
                      name="linkedin"
                      label="linkedin"
                      value={this.state.accountDetails.linkedin || ""}
                      variant="outlined"
                      onChange={this.accountDetailsChange}
                    />
                  </div>
                  <div className="textfield-container-row">
                    <TextField
                      type="text"
                      name="facebook"
                      label="facebook"
                      value={this.state.accountDetails.facebook || ""}
                      variant="outlined"
                      onChange={this.accountDetailsChange}
                    />
                  </div>
                  <div className="textfield-container-row">
                    <TextField
                      type="text"
                      name="youtube"
                      label="youtube"
                      value={this.state.accountDetails.youtube || ""}
                      variant="outlined"
                      onChange={this.accountDetailsChange}
                    />
                  </div>
                  <div className="textfield-container-row">
                    <TextField
                      type="text"
                      name="instagram"
                      label="instagram"
                      value={this.state.accountDetails.instagram || ""}
                      variant="outlined"
                      onChange={this.accountDetailsChange}
                    />
                  </div>
                  <div className="textfield-container-row">
                    <TextField
                      type="text"
                      name="website"
                      label="website"
                      value={this.state.accountDetails.website || ""}
                      variant="outlined"
                      onChange={this.accountDetailsChange}
                    />
                  </div>
                </Aux>
              ) : null}
              <Button
                onClick={this.saveChangesClickHandler}
                variant="contained"
                color="secondary"
                disabled={!this.state.hasEditedDetails}
              >
                SAVE DETAILS
              </Button>
            </form>
          </div>
          <div className="textfield-container">
            <form>
              <h2 className="form-title">CHANGE PASSWORD</h2>
              <div className="textfield-container-row">
                <TextField
                  type="password"
                  name="password"
                  label="old password"
                  value={this.state.passwordDetails.password || ""}
                  variant="outlined"
                  onChange={this.passwordChange}
                />
              </div>
              <div className="textfield-container-row">
                <TextField
                  type="password"
                  name="newPassword"
                  label="new password"
                  value={this.state.passwordDetails.newPassword || ""}
                  variant="outlined"
                  onChange={this.passwordChange}
                />
              </div>
              <div className="textfield-container-row">
                <TextField
                  type="password"
                  name="confirmNewPassword"
                  label="confirm new password"
                  value={this.state.passwordDetails.confirmNewPassword || ""}
                  variant="outlined"
                  onChange={this.passwordChange}
                />
              </div>
              <Button
                onClick={this.changePasswordClickHandler}
                variant="contained"
                color="secondary"
                disabled={
                  !this.state.passwordDetails.password ||
                  !this.state.passwordDetails.newPassword ||
                  !this.state.passwordDetails.confirmNewPassword
                }
              >
                CHANGE PASSWORD
              </Button>
            </form>
          </div>
        </div>
        {this.state.isLoading ? <Backdrop /> : null}
      </Aux>
    );
  }
}

export default SettingsPage;
