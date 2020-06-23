import React, { Component } from "react";
import "./AdminPage.css";
import Title from "../../components/UI/Title/Title";
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

import { AccountService } from "../../services/account";
import { ServicesService } from "../../services/service";

class AdminPage extends Component {
  provinces = [
    {
      value: "ON",
      label: "Ontario"
    }
  ];

  typeToCreate = [
    {
      value: 1,
      label: "User"
    },
    {
      value: 2,
      label: "Service"
    }
  ];

  userTypes = [
    {
      value: 1,
      label: "Contractor"
    },
    {
      value: 2,
      label: "Inspector"
    }
  ];

  state = {
    accountDetails: {
      email: null,
      password: null,
      confirmPassword: null,
      firstName: null,
      lastName: null,
      phone: null,
      address: null,
      city: null,
      postalCode: null,
      province: null,
      bio: null,
      photo: null,
      linkedin: null,
      facebook: null,
      youtube: null,
      instagram: null,
      website: null,
      services: null
    },
    serviceDetails: {
      serviceName: null,
      description: null
    },
    services: null,
    typeToCreate: null, // 1 = USER, 2 = SERVICE
    userType: null, // 1 = CONTRACTOR, 2 = INSPECTOR
    hasEditedDetails: false,
    isLoading: false
  };

  componentDidMount() {
    this.setState({ isLoading: true });
    ServicesService.getServices(1)
      .then(res => {
        this.setState({ services: res.data, isLoading: false });
      })
      .catch(error => {
        // this.displayMessage(
        //   "Error while getting service details: " + error.response,
        //   false
        // );
      });
  }

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

  resetClickHandler = () => {};

  accountDetailsChange = event => {
    const newAccountDetails = Object.assign(this.state.accountDetails, {
      [event.target.name]: event.target.value
    });
    this.setState({
      accountDetails: newAccountDetails,
      hasEditedDetails: true
    });
  };

  serviceDetailsChange = event => {
    const newServiceDetails = Object.assign(this.state.serviceDetails, {
      [event.target.name]: event.target.value
    });
    this.setState({
      serviceDetails: newServiceDetails,
      hasEditedDetails: true
    });
  };

  render() {
    return (
      <div className="admin-page-container">
        {this.state.services && (
          <Aux>
            <Title>ADMIN PANEL</Title>
            <div className="button-container">
              <Button
                onClick={this.saveChangesClickHandler}
                variant="contained"
                color="primary"
                disabled={!this.state.hasEditedDetails}
              >
                CREATE
              </Button>
              <Button
                onClick={this.saveChangesClickHandler}
                variant="contained"
                color="secondary"
                disabled={!this.state.typeToCreate}
              >
                RESET
              </Button>
            </div>
            <div className="textfield-container-row">
              <TextField
                select
                name="create"
                label="create"
                value={this.state.typeToCreate || ""}
                onChange={event => {
                  this.setState({ typeToCreate: event.target.value });
                }}
                variant="outlined"
              >
                {this.typeToCreate.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </div>
            {this.state.typeToCreate === 1 ? (
              <Aux>
                <div className="textfield-container-row">
                  <TextField
                    select
                    name="userType"
                    label="type"
                    value={this.state.userType || ""}
                    onChange={event => {
                      this.setState({ userType: event.target.value });
                    }}
                    variant="outlined"
                  >
                    {this.userTypes.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>
                {this.state.userType !== null ? (
                  <div className="textfield-container">
                    <h2 className="form-title">LOGIN DETAILS</h2>
                    <div className="textfield-container-row">
                      <TextField
                        type="text"
                        name="email"
                        label="email"
                        value={this.state.accountDetails.email || ""}
                        variant="outlined"
                        onChange={this.accountDetailsChange}
                      />
                    </div>
                    <div className="textfield-container-row">
                      <TextField
                        type="password"
                        name="password"
                        label="password"
                        value={this.state.accountDetails.password || ""}
                        variant="outlined"
                        onChange={this.accountDetailsChange}
                      />
                    </div>
                    <div className="textfield-container-row">
                      <TextField
                        type="password"
                        name="confirmPassword"
                        label="confirm password"
                        value={this.state.accountDetails.confirmPassword || ""}
                        variant="outlined"
                        onChange={this.accountDetailsChange}
                      />
                    </div>
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
                          <FormGroup>
                            {this.state.services.map(service => (
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    onChange={event => {
                                      var accountDetailsCopy = this.state
                                        .accountDetails;

                                      if (event.target.checked) {
                                        accountDetailsCopy.services.push(
                                          event.target.value
                                        );

                                        this.setState({
                                          accountDetails: accountDetailsCopy,
                                          hasEditedDetails: true
                                        });
                                      } else {
                                        const index = accountDetailsCopy.services.indexOf(
                                          event.target.value
                                        );

                                        if (index !== -1) {
                                          accountDetailsCopy.services.splice(
                                            index,
                                            1
                                          );

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
                  </div>
                ) : null}
              </Aux>
            ) : null}
            {this.state.typeToCreate === 2 ? (
              <Aux>
                <h2 className="form-title">SERVICE DETAILS</h2>
                <div className="textfield-container">
                  <div className="textfield-container-row">
                    <TextField
                      type="text"
                      name="serviceName"
                      label="service name"
                      value={this.state.serviceDetails.serviceName || ""}
                      variant="outlined"
                      onChange={this.serviceDetailsChange}
                    />
                  </div>
                  <div className="textfield-container-row">
                    <TextField
                      multiline
                      rowsMax={6}
                      type="text"
                      name="description"
                      label="description"
                      value={this.state.serviceDetails.description || ""}
                      variant="outlined"
                      onChange={this.serviceDetailsChange}
                    />
                  </div>
                </div>
              </Aux>
            ) : null}
          </Aux>
        )}
        {this.state.isLoading ? <Backdrop /> : null}
      </div>
    );
  }
}

export default AdminPage;
