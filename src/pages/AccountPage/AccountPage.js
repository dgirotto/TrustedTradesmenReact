import React, { Component } from "react";
import "./AccountPage.css";

class AccountPage extends Component {
  state = {
    accountInfo: {
      email: null,
      password: null,
      newPassword: null,
      confirmNewPassword: null,
      firstName: null,
      lastName: null,
      phone: null,
      addressId: null,
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

  // user/update.php:
  // 0, 2, 3: (firstName, lastName, phone, addressId, )
  // 1:

  render() {
    return (
      <div className="account-details-container">
        <h3 className="account-details__title">Account Page</h3>
      </div>
    );
  }
}

export default AccountPage;
