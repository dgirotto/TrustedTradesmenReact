import React, { Component } from "react";
import "./SettingsPage.css";

import Aux from "../../helpers/Aux";
import Title from "../../components/UI/Title/Title";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import { AuthService } from "../../services/auth";
import { AccountService } from "../../services/account";

// How to style MatUI text fields: https://stackoverflow.com/questions/46966413/how-to-style-material-ui-textfield

class SettingsPage extends Component {
  state = {
    userType: AuthService.getRole(),
    accountDetails: {
      email: null,
      password: null,
      newPassword: null,
      confirmNewPassword: null,
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
    hasEdited: false,
    isLoading: false
  };

  // user/change_pwd.php: (password, newPassword)
  //
  // user/update.php:
  // 0, 2, 3: (firstName, lastName, phone, address, city, postalCode, province)
  // 1: (firstName, lastName, phone, address, city, postalCode, province, bio,
  //     photo, linkedin, facebook, youtube, instagram, website, services)

  componentDidMount() {
    this.setState({ isLoading: true });

    AccountService.getAccountDetails()
      .then(res => {
        this.setState({ accountDetails: res.data });
        this.setState({ isLoading: false });
        console.log(this.state.accountDetails);
      })
      .catch(err => {
        console.error("Error while getting account details: " + err.response);
      });
  }

  saveChangesClickHandler = () => {
    if (window.confirm("Are you sure you want to save your changes?")) {
      // Save changes
      this.setState({
        hasEdited: false
      });
    }
  };

  change = event => {
    this.setState({
      accountDetails: { [event.target.name]: event.target.value },
      hasEdited: true
    });
  };

  render() {
    return (
      <div className="account-details-container">
        <div className="textfield-container">
          <form>
            <Button
              onClick={this.saveChangesClickHandler}
              variant="contained"
              color="secondary"
              disabled={!this.state.hasEdited}
            >
              Save Changes
            </Button>
            <Title align="Left" size="Small" color="Black">
              CONTACT INFORMATION
            </Title>
            <div className="textfield-container-row">
              <div>First Name</div>
              <div>
                <TextField
                  type="text"
                  name="firstName"
                  value={this.state.accountDetails.firstName}
                  variant="outlined"
                  onChange={this.change}
                />
              </div>
            </div>
            <div className="textfield-container-row">
              <div>Last Name</div>
              <div>
                <TextField
                  type="text"
                  name="lastName"
                  value={this.state.accountDetails.lastName}
                  variant="outlined"
                  onChange={this.change}
                />
              </div>
            </div>
            <div className="textfield-container-row">
              <div>Phone</div>
              <div>
                <TextField
                  type="text"
                  name="phone"
                  value={this.state.accountDetails.phone}
                  variant="outlined"
                  onChange={this.change}
                />
              </div>
            </div>
            <br />
            <Title align="Left" size="Small" color="Black">
              ADDRESS DETAILS
            </Title>
            <div className="textfield-container-row">
              <div>Address</div>
              <div>
                <TextField
                  type="text"
                  name="address"
                  value={this.state.accountDetails.address}
                  variant="outlined"
                  onChange={this.change}
                />
              </div>
            </div>
            <div className="textfield-container-row">
              <div>City</div>
              <div>
                <TextField
                  type="text"
                  name="city"
                  value={this.state.accountDetails.city}
                  variant="outlined"
                  onChange={this.change}
                />
              </div>
            </div>
            <div className="textfield-container-row">
              <div>Postal Code</div>
              <div>
                <TextField
                  type="text"
                  name="postalCode"
                  value={this.state.accountDetails.postalCode}
                  variant="outlined"
                  onChange={this.change}
                />
              </div>
            </div>
            <div className="textfield-container-row">
              <div>Province</div>
              <div>
                <TextField
                  type="text"
                  name="province"
                  value={this.state.accountDetails.province}
                  variant="outlined"
                  onChange={this.change}
                />
              </div>
            </div>
            {this.state.userType == 1 ? (
              <Aux>
                <br />
                <Title align="Left" size="Small" color="Black">
                  CONTRACTOR DETAILS
                </Title>
                <div className="textfield-container-row">
                  <div>Bio</div>
                  <div>
                    <TextField
                      type="text"
                      name="bio"
                      value={this.state.accountDetails.bio}
                      variant="outlined"
                      onChange={this.change}
                    />
                  </div>
                </div>
                <div className="textfield-container-row">
                  <div>Linkedin</div>
                  <div>
                    <TextField
                      type="text"
                      name="linkedin"
                      value={this.state.accountDetails.linkedin}
                      variant="outlined"
                      onChange={this.change}
                    />
                  </div>
                </div>
                <div className="textfield-container-row">
                  <div>Facebook</div>
                  <div>
                    <TextField
                      type="text"
                      name="facebook"
                      value={this.state.accountDetails.facebook}
                      variant="outlined"
                      onChange={this.change}
                    />
                  </div>
                </div>
                <div className="textfield-container-row">
                  <div>Youtube</div>
                  <div>
                    <TextField
                      type="text"
                      name="youtube"
                      value={this.state.accountDetails.youtube}
                      variant="outlined"
                      onChange={this.change}
                    />
                  </div>
                </div>
                <div className="textfield-container-row">
                  <div>Instagram</div>
                  <div>
                    <TextField
                      type="text"
                      name="instagram"
                      value={this.state.accountDetails.instagram}
                      variant="outlined"
                      onChange={this.change}
                    />
                  </div>
                </div>
                <div className="textfield-container-row">
                  <div>Website</div>
                  <div>
                    <TextField
                      type="text"
                      name="website"
                      value={this.state.accountDetails.website}
                      variant="outlined"
                      onChange={this.change}
                    />
                  </div>
                </div>
              </Aux>
            ) : null}
          </form>
        </div>
        {/* <form>
          <Title size="Small" color="Black">
            Change Password
          </Title>
        </form> */}
      </div>
    );
  }
}

export default SettingsPage;
