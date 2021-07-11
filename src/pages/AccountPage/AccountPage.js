import React, { Component } from "react";

import "./AccountPage.css";

import { AuthService } from "../../services/auth";
import { AccountService } from "../../services/account";
import { ServicesService } from "../../services/service";

import Backdrop from "../../components/UI/Backdrop/Backdrop";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

// How to style MatUI text fields: https://stackoverflow.com/questions/46966413/how-to-style-material-ui-textfield

function AlertPopup(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class AccountPage extends Component {
  provinces = [
    {
      value: "ON",
      label: "Ontario"
    }
  ];

  maxDistances = [
    {
      value: 30,
      label: "30 km"
    },
    {
      value: 50,
      label: "50 km"
    },
    {
      value: 80,
      label: "80 km"
    },
    {
      value: 120,
      label: "120 km"
    },
    {
      value: 170,
      label: "170 km"
    },
    {
      value: 999,
      label: "Over 170 km"
    }
  ];

  state = {
    userType: AuthService.getRole(),
    accountDetails: {
      email: null,
      firstName: null,
      lastName: null,
      phone: null,
      addressId: null,
      address: null,
      city: null,
      postalCode: null,
      province: null,
      maxDistance: null,
      bio: null,
      photo: null,
      linkedin: null,
      facebook: null,
      youtube: null,
      instagram: null,
      website: null,
      services: null
    },
    passwordDetails: {
      currentPassword: null,
      newPassword: null,
      confirmNewPassword: null
    },
    profilePicture: null,
    services: null,
    hasEditedDetails: false,
    isLoading: false,
    showSnackbar: false,
    isError: false,
    message: "",
    activeTab: 0
  };

  componentDidMount() {
    this.setState({ isLoading: true });

    AccountService.getAccountDetails()
      .then(res => {
        if (this.state.userType === 1) {
          res.data.services = res.data.services !== null ? res.data.services.split(",") : [];
        }
        this.setState({ accountDetails: res.data });
      })
      .catch(error => {
        this.setMessage(true, "Unable to obtain account details");
      })
      .then(() => {
        if (this.state.userType === 1) {
          ServicesService.getServices()
            .then(res => {
              this.setState({ services: res.data, isLoading: false });
            })
            .catch(() => {
              this.setMessage(true, "Unable to get service list");
            });
        } else {
          this.setState({ isLoading: false });
        }
      });
  }

  fileSelectedHandler = event => {
    this.setState({ profilePicture: event.target.files[0] });
  }

  uploadFileClickHandler = () => {
    AccountService.uploadProfilePicture(this.state.profilePicture);
  }

  appBarClickHandler = (event, newValue) => {
    this.setState({ activeTab: newValue });
  }

  saveChangesClickHandler = () => {
    this.setState({ isLoading: true });

    AccountService.setAccountDetails(this.state.accountDetails)
      .then(() => {
        this.setMessage(false, "Account details successfully updated");
      })
      .catch(() => {
        this.setMessage(true, "Could not update account details");
      });

    this.setState({
      hasEditedDetails: false,
      isLoading: false
    });
  };

  changePasswordClickHandler = () => {
    if (
      this.state.passwordDetails.newPassword !==
      this.state.passwordDetails.confirmNewPassword
    ) {
      this.setMessage(true, "New passwords don't match");
      return;
    }

    this.setState({ isLoading: true });

    AccountService.changePassword({
      password: this.state.passwordDetails.currentPassword,
      newPassword: this.state.passwordDetails.newPassword
    })
      .then(() => {
        this.setMessage(false, "Successfully updated password");
        this.setState({
          isLoading: false,
          passwordDetails: {
            currentPassword: "",
            newPassword: "",
            confirmNewPassword: ""
          }
        });
      })
      .catch(() => {
        this.setMessage(true, "Current password is incorrect");
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
      passwordDetails: newPasswordDetails
    });
  };

  setMessage = (isError, message) => {
    this.setState({
      showSnackbar: true,
      isError: isError,
      message: message
    });
  }

  toggleSnackbar = () => {
    this.setState({ showSnackbar: !this.state.showSnackbar });
  };

  render() {
    return (
      <>
        <AppBar
          position="relative"
          color="secondary"
          style={{ zIndex: "998" }}>
          <Tabs
            value={this.state.activeTab}
            onChange={this.appBarClickHandler}
            centered
          >
            <Tab
              label="Account Details"
              wrapped />
            <Tab label="Change Password"
              wrapped />
          </Tabs>
        </AppBar>
        <div className="page-container">
          {!this.state.isLoading && (
            <>
              {this.state.activeTab === 0 ? (
                <div style={{ marginBottom: "25px" }}>
                  <h2 style={{ textAlign: "center" }} className="form-title">Account Details</h2>
                  {/* UPLOADING FILES: https://www.youtube.com/watch?v=XeiOnkEI7XI&ab_channel=Academind */}
                  {/* <div style={{ marginBottom: "20px" }}>
                    <span className="field-desc">Upload a photo for your profile page.</span>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <input
                        type="file"
                        onChange={this.fileSelectedHandler}
                        style={{ marginRight: "20px", fontSize: "16px" }}
                      />
                      <Button
                        style={{ fontWeight: "bold" }}
                        onClick={this.uploadFileClickHandler}
                        variant="contained"
                        color="secondary"
                        disabled={!this.state.profilePicture}
                      >
                        UPLOAD
                      </Button>
                    </div>
                  </div> */}
                  <div className="textfield-container-row">
                    <div className="textfield-container-col">
                      <TextField
                        type="text"
                        name="firstName"
                        label="First Name"
                        value={this.state.accountDetails.firstName || ""}
                        variant="outlined"
                        onChange={this.accountDetailsChange}
                      />
                    </div>
                    <div className="textfield-container-col">
                      <TextField
                        type="text"
                        name="lastName"
                        label="Last Name"
                        value={this.state.accountDetails.lastName || ""}
                        variant="outlined"
                        onChange={this.accountDetailsChange}
                      />
                    </div>
                    <div className="textfield-container-col">
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
                  <div className="textfield-container-col">
                    <TextField
                      type="text"
                      name="address"
                      label="Address"
                      value={this.state.accountDetails.address || ""}
                      variant="outlined"
                      onChange={this.accountDetailsChange}
                    />
                  </div>
                  <div className="textfield-container-row">
                    <div className="textfield-container-col">
                      <TextField
                        type="text"
                        name="city"
                        label="City"
                        value={this.state.accountDetails.city || ""}
                        variant="outlined"
                        onChange={this.accountDetailsChange}
                      />
                    </div>
                    <div className="textfield-container-col">
                      <TextField
                        select
                        name="province"
                        label="Province"
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
                    <div className="textfield-container-col">
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
                  {/* <span className="field-desc">Since your email address is required to login, updating your email will change your login credentials.</span>
                  <div className="textfield-container-col">
                    <TextField
                      type="text"
                      name="email"
                      label="Email"
                      value={this.state.accountDetails.email || ""}
                      variant="outlined"
                      onChange={this.accountDetailsChange}
                    />
                  </div> */}
                  {(this.state.userType === 1 || this.state.userType === 2) && (
                    <>
                      <span className="field-desc">How far are you willing to travel for a job?</span>
                      <div className="textfield-container-col">
                        <TextField
                          select
                          name="maxDistance"
                          label="Max Travel Distance"
                          value={this.state.accountDetails.maxDistance || ""}
                          onChange={this.accountDetailsChange}
                          variant="outlined"
                        >
                          {this.maxDistances.map(option => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </TextField>
                      </div>
                    </>
                  )}
                  {this.state.userType === 1 && this.state.services !== null && (
                    <>
                      <span className="field-desc">Which services are you capable of providing? Please select only those of which you <b>specialize</b> in.</span>
                      <FormControl style={{ marginBottom: "20px" }} component="fieldset">
                        <FormGroup style={{ flexDirection: "row" }}>
                          {this.state.services.map(service => (
                            <FormControlLabel
                              style={{ width: "225px" }}
                              control={
                                <Checkbox
                                  onChange={event => {
                                    var accountDetailsCopy = this.state.accountDetails;

                                    if (event.target.checked) {
                                      accountDetailsCopy.services.push(
                                        event.target.value
                                      );

                                      this.setState({
                                        accountDetails: accountDetailsCopy,
                                        hasEditedDetails: true
                                      });
                                    }
                                    else {
                                      const index = accountDetailsCopy.services.indexOf(
                                        event.target.value
                                      );

                                      if (index !== -1) {
                                        accountDetailsCopy.services.splice(index, 1);

                                        this.setState({
                                          accountDetails: accountDetailsCopy,
                                          hasEditedDetails: true
                                        });
                                      }
                                    }
                                  }}
                                  value={service.serviceId}
                                  name={service.serviceName}
                                  checked={
                                    this.state.accountDetails.services &&
                                    this.state.accountDetails.services.includes(
                                      service.serviceId
                                    )
                                  }
                                />
                              }
                              label={service.serviceName}
                              key={service.serviceId}
                            />
                          ))}
                        </FormGroup>
                      </FormControl>
                      <div className="textfield-container-col">
                        <TextField
                          type="text"
                          name="companyName"
                          label="Company Name"
                          value={this.state.accountDetails.companyName || ""}
                          variant="outlined"
                          onChange={this.accountDetailsChange}
                        />
                      </div>
                      <span className="field-desc">List any deals or specials you wish to be highlighted on your profile page.</span>
                      <div className="textfield-container-col">
                        <TextField
                          multiline
                          rowsMax={6}
                          type="text"
                          name="specials"
                          label="Specials"
                          value={this.state.accountDetails.specials || ""}
                          variant="outlined"
                          onChange={this.accountDetailsChange}
                        />
                      </div>
                      <span className="field-desc">How would you describe yourself? This will be displayed on your profile page.</span>
                      <div className="textfield-container-col">
                        <TextField
                          multiline
                          rowsMax={6}
                          type="text"
                          name="bio"
                          label="Bio"
                          value={this.state.accountDetails.bio || ""}
                          variant="outlined"
                          onChange={this.accountDetailsChange}
                        />
                      </div>
                      <span className="field-desc">Include links to each of your social media profiles. These links will be displayed on your profile page.</span>
                      <div className="textfield-container-row">
                        <div className="textfield-container-col">
                          <TextField
                            type="text"
                            name="linkedin"
                            label="LinkedIn"
                            value={this.state.accountDetails.linkedin || ""}
                            variant="outlined"
                            onChange={this.accountDetailsChange}
                          />
                        </div>
                        <div className="textfield-container-col">
                          <TextField
                            type="text"
                            name="facebook"
                            label="Facebook"
                            value={this.state.accountDetails.facebook || ""}
                            variant="outlined"
                            onChange={this.accountDetailsChange}
                          />
                        </div>
                        <div className="textfield-container-col">
                          <TextField
                            type="text"
                            name="youtube"
                            label="YouTube"
                            value={this.state.accountDetails.youtube || ""}
                            variant="outlined"
                            onChange={this.accountDetailsChange}
                          />
                        </div>
                      </div>
                      <div className="textfield-container-row">
                        <div className="textfield-container-col">
                          <TextField
                            type="text"
                            name="instagram"
                            label="Instagram"
                            value={this.state.accountDetails.instagram || ""}
                            variant="outlined"
                            onChange={this.accountDetailsChange}
                          />
                        </div>
                        <div className="textfield-container-col">
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
                    </>
                  )}
                  <Button
                    style={{ fontWeight: "bold" }}
                    onClick={this.saveChangesClickHandler}
                    variant="contained"
                    color="secondary"
                    disabled={!this.state.hasEditedDetails || this.state.accountDetails.email.trim() === ''}
                  >
                    SAVE DETAILS
                  </Button>
                </div>
              ) : (
                <>
                  <h2 style={{ textAlign: "center" }} className="form-title">Change Password</h2>
                  <div className="textfield-container-row">
                    <div className="textfield-container-col">
                      <TextField
                        type="password"
                        name="currentPassword"
                        label="Current Password"
                        value={this.state.passwordDetails.currentPassword || ""}
                        variant="outlined"
                        onChange={this.passwordChange}
                      />
                    </div>
                    <div className="textfield-container-col">
                      <TextField
                        type="password"
                        name="newPassword"
                        label="New Password"
                        value={this.state.passwordDetails.newPassword || ""}
                        variant="outlined"
                        onChange={this.passwordChange}
                      />
                    </div>
                    <div className="textfield-container-col">
                      <TextField
                        type="password"
                        name="confirmNewPassword"
                        label="Confirm New Password"
                        value={this.state.passwordDetails.confirmNewPassword || ""}
                        variant="outlined"
                        onChange={this.passwordChange}
                      />
                    </div>
                  </div>
                  <Button
                    style={{ fontWeight: "bold" }}
                    onClick={this.changePasswordClickHandler}
                    variant="contained"
                    color="secondary"
                    disabled={
                      !(
                        this.state.passwordDetails.currentPassword &&
                        this.state.passwordDetails.newPassword &&
                        this.state.passwordDetails.confirmNewPassword
                      )
                    }
                  >
                    CHANGE PASSWORD
                  </Button>
                </>
              )}
            </>
          )}

          {this.state.isLoading ? <Backdrop /> : null}

          <Snackbar
            open={this.state.showSnackbar}
            autoHideDuration={5000}
            onClose={this.toggleSnackbar}
          >
            <AlertPopup onClose={this.toggleSnackbar} severity={this.state.isError ? "error" : "success"}>
              {this.state.message}
            </AlertPopup>
          </Snackbar>

        </div >
      </>
    );
  }
}

export default AccountPage;
