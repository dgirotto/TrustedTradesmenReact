import React, { Component } from "react";
import "./AccountPage.css";

class AccountPage extends Component {
  state = {
    accountInfo: {
      email: null,
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

  render() {
    return (
      <div className="account-details-container">
        <h3 className="account-details__title">Account Page</h3>
      </div>
    );
  }
}

export default AccountPage;
