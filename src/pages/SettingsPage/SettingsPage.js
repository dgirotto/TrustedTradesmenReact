import React, { Component } from "react";
import "./SettingsPage.css";
import { FaHammer } from "react-icons/fa";
import { TiContacts } from "react-icons/ti";
import { IoMdContact } from "react-icons/io";
import Aux from "../../helpers/Aux";
import Title from "../../components/UI/Title/Title";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

class SettingsPage extends Component {
  state = {
    isEditing: false,
    // accountType: this.props.accountType,
    accountType: 1,
    accountInfo: {
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
    }
  };

  // user/change_pwd.php: (password, newPassword)
  //
  // user/update.php:
  // 0, 2, 3: (firstName, lastName, phone, address, city, postalCode, province)
  // 1: (firstName, lastName, phone, address, city, postalCode, province, bio,
  //     photo, linkedin, facebook, youtx1ube, instagram, website, services)

  render() {
    return (
      <div className="account-details-container">
        <div className="textfield-container">
          <form>
            <Title align="Left" size="Small" color="Black">
              <IoMdContact size="25" />
              &nbsp; CONTACT INFORMATION
            </Title>
            <div className="textfield-container-row">
              <div>First Name</div>
              <div>
                <TextField
                  type="text"
                  name="firstName"
                  value={this.state.accountInfo.firstName}
                  variant="outlined"
                  disabled={!this.state.isEditing}
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
                  value={this.state.accountInfo.lastName}
                  variant="outlined"
                  disabled={!this.state.isEditing}
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
                  value={this.state.accountInfo.phone}
                  variant="outlined"
                  disabled={!this.state.isEditing}
                  onChange={this.change}
                />
              </div>
            </div>
            <br />
            <Title align="Left" size="Small" color="Black">
              <TiContacts size="25" />
              &nbsp; ADDRESS DETAILS
            </Title>
            <div className="textfield-container-row">
              <div>Address</div>
              <div>
                <TextField
                  type="text"
                  name="address"
                  value={this.state.accountInfo.address}
                  variant="outlined"
                  disabled={!this.state.isEditing}
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
                  value={this.state.accountInfo.city}
                  variant="outlined"
                  disabled={!this.state.isEditing}
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
                  value={this.state.accountInfo.postalCode}
                  variant="outlined"
                  disabled={!this.state.isEditing}
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
                  value={this.state.accountInfo.province}
                  variant="outlined"
                  disabled={!this.state.isEditing}
                  onChange={this.change}
                />
              </div>
            </div>
            {this.state.accountType === 1 ? (
              <Aux>
                <br />
                <Title align="Left" size="Small" color="Black">
                  <FaHammer size="18" />
                  &nbsp; CONTRACTOR DETAILS
                </Title>
                <div className="textfield-container-row">
                  <div>Bio</div>
                  <div>
                    <TextField
                      type="text"
                      name="bio"
                      value={this.state.accountInfo.bio}
                      variant="outlined"
                      disabled={!this.state.isEditing}
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
                      value={this.state.accountInfo.linkedin}
                      variant="outlined"
                      disabled={!this.state.isEditing}
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
                      value={this.state.accountInfo.facebook}
                      variant="outlined"
                      disabled={!this.state.isEditing}
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
                      value={this.state.accountInfo.youtube}
                      variant="outlined"
                      disabled={!this.state.isEditing}
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
                      value={this.state.accountInfo.instagram}
                      variant="outlined"
                      disabled={!this.state.isEditing}
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
                      value={this.state.accountInfo.website}
                      variant="outlined"
                      disabled={!this.state.isEditing}
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
