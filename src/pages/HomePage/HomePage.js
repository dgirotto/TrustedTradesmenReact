import React, { Component } from "react";
import "./HomePage.css";

import Title from "../../components/UI/Title/Title";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import { FaUserCircle, FaToolbox, FaMoneyBillWave } from "react-icons/fa";

class HomePage extends Component {
  render() {
    return (
      <div className="home-container">
        <Title size="Large" color="Black" align="Center">
          HOW IT WORKS
        </Title>
        <div className="card-container">
          <div className="card">
            <span class="card-title">1</span>
            <Divider variant="middle" />
            <FaUserCircle className="card-icon" size="60" />
            CREATE AN ACCOUNT AND LOGIN
            <Button
              className="home-button"
              onClick={() => (window.location.href = "/register")}
              variant="contained"
              color="primary"
            >
              REGISTER
            </Button>
            <span>OR</span>
            <Button
              className="home-button"
              onClick={() => (window.location.href = "/login")}
              variant="contained"
              color="primary"
            >
              LOGIN
            </Button>
          </div>
          <div className="card">
            <span class="card-title">2</span>
            <Divider variant="middle" />
            <FaToolbox className="card-icon" size="60" />
            CHOOSE FROM ONE OF OUR MANY SERVICES
            <Button
              className="home-button"
              onClick={() => (window.location.href = "/services")}
              variant="contained"
              color="primary"
            >
              SERVICES
            </Button>
          </div>
          <div className="card">
            <span class="card-title">3</span>
            <Divider variant="middle" />
            <FaMoneyBillWave className="card-icon" size="60" />
            RECEIVE A QUOTE FROM ONE OF OUR QUALIFIED TRADESMEN
          </div>
        </div>
      </div>
    );
  }
}

export default HomePage;
