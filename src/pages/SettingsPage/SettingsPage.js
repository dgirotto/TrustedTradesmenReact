import React, { Component } from "react";
import "./SettingsPage.css";
import Title from "../../components/UI/Title/Title";
import Loader from "../../components/UI/Loader/Loader";
import Backdrop from "../../components/UI/Backdrop/Backdrop";
import Aux from "../../helpers/Aux";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { AuthService } from "../../services/auth";
import { AccountService } from "../../services/account";

// How to style MatUI text fields: https://stackoverflow.com/questions/46966413/how-to-style-material-ui-textfield

class SettingsPage extends Component {
  state = {
    userType: AuthService.getRole(),
    accountDetails: {
      email: "",
      firstName: "",
      lastName: "",
      phone: "",
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
    hasEditedDetails: false,
    hasEditedPassword: false,
    isLoading: false
  };

  componentDidMount() {
    this.setState({ isLoading: true });

    AccountService.getAccountDetails()
      .then(res => {
        this.setState({ accountDetails: res.data });
        this.setState({ isLoading: false });
        console.log(this.state.accountDetails);
      })
      .catch(error => {
        this.displayMessage(
          "Error while getting account details: " + error.response,
          false
        );
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
          hasEditedPassword: false,
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
      passwordDetails: newPasswordDetails,
      hasEditedPassword: true
    });
  };

  render() {
    return (
      <Aux>
        {!this.state.isLoading && (
          <div className="account-details-container">
            <div className="textfield-container">
              <form>
                <Title align="Left" size="Small" color="Black">
                  CONTACT DETAILS
                </Title>
                <div className="textfield-container-row">
                  <div>
                    <TextField
                      type="text"
                      name="firstName"
                      label="First Name"
                      value={this.state.accountDetails.firstName || ""}
                      variant="outlined"
                      onChange={this.accountDetailsChange}
                    />
                  </div>
                </div>
                <div className="textfield-container-row">
                  <div>
                    <TextField
                      type="text"
                      name="lastName"
                      label="Last Name"
                      value={this.state.accountDetails.lastName || ""}
                      variant="outlined"
                      onChange={this.accountDetailsChange}
                    />
                  </div>
                </div>
                <div className="textfield-container-row">
                  <div>
                    <TextField
                      type="text"
                      name="phone"
                      label="Phone"
                      value={this.state.accountDetails.phone || ""}
                      variant="outlined"
                      onChange={this.accountDetailsChange}
                    />
                  </div>
                </div>
                <br />
                <Title align="Left" size="Small" color="Black">
                  ADDRESS DETAILS
                </Title>
                <div className="textfield-container-row">
                  <div>
                    <TextField
                      type="text"
                      name="address"
                      label="Address"
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
                      label="City"
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
                      label="Postal Code"
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
                      label="Province"
                      value={this.state.accountDetails.province || ""}
                      variant="outlined"
                      onChange={this.accountDetailsChange}
                    />
                  </div>
                </div>
                {this.state.userType === 1 ? (
                  <Aux>
                    <br />
                    <Title align="Left" size="Small" color="Black">
                      CONTRACTOR DETAILS
                    </Title>
                    <div className="textfield-container-row">
                      <div>
                        <TextField
                          type="text"
                          name="bio"
                          label="Bio"
                          value={this.state.accountDetails.bio || ""}
                          variant="outlined"
                          onChange={this.accountDetailsChange}
                        />
                      </div>
                    </div>
                    <div className="textfield-container-row">
                      <div>
                        <TextField
                          type="text"
                          name="linkedin"
                          label="Linkedin"
                          value={this.state.accountDetails.linkedin || ""}
                          variant="outlined"
                          onChange={this.accountDetailsChange}
                        />
                      </div>
                    </div>
                    <div className="textfield-container-row">
                      <div>
                        <TextField
                          type="text"
                          name="facebook"
                          label="Facebook"
                          value={this.state.accountDetails.facebook || ""}
                          variant="outlined"
                          onChange={this.accountDetailsChange}
                        />
                      </div>
                    </div>
                    <div className="textfield-container-row">
                      <div>
                        <TextField
                          type="text"
                          name="youtube"
                          label="Youtube"
                          value={this.state.accountDetails.youtube || ""}
                          variant="outlined"
                          onChange={this.accountDetailsChange}
                        />
                      </div>
                    </div>
                    <div className="textfield-container-row">
                      <div>
                        <TextField
                          type="text"
                          name="instagram"
                          label="Instagram"
                          value={this.state.accountDetails.instagram || ""}
                          variant="outlined"
                          onChange={this.accountDetailsChange}
                        />
                      </div>
                    </div>
                    <div className="textfield-container-row">
                      <div>
                        <TextField
                          type="text"
                          name="website"
                          label="Website"
                          value={this.state.accountDetails.website || ""}
                          variant="outlined"
                          onChange={this.accountDetailsChange}
                        />
                      </div>
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
                <Title size="Small" color="Black">
                  CHANGE PASSWORD
                </Title>
                <div className="textfield-container-row">
                  <div>
                    <TextField
                      type="password"
                      name="password"
                      label="Old Password"
                      value={this.state.passwordDetails.password || ""}
                      variant="outlined"
                      onChange={this.passwordChange}
                    />
                  </div>
                </div>
                <div className="textfield-container-row">
                  <div>
                    <TextField
                      type="password"
                      name="newPassword"
                      label="New Password"
                      value={this.state.passwordDetails.newPassword || ""}
                      variant="outlined"
                      onChange={this.passwordChange}
                    />
                  </div>
                </div>
                <div className="textfield-container-row">
                  <div>
                    <TextField
                      type="password"
                      name="confirmNewPassword"
                      label="Confirm New Password"
                      value={
                        this.state.passwordDetails.confirmNewPassword || ""
                      }
                      variant="outlined"
                      onChange={this.passwordChange}
                    />
                  </div>
                </div>
                <Button
                  onClick={this.changePasswordClickHandler}
                  variant="contained"
                  color="secondary"
                  disabled={!this.state.hasEditedPassword}
                >
                  CHANGE PASSWORD
                </Button>
              </form>
            </div>
          </div>
        )}
        {this.state.isLoading && (
          <Aux>
            <Loader size={60} />
            <Backdrop />
          </Aux>
        )}
      </Aux>
    );
  }
}

export default SettingsPage;
