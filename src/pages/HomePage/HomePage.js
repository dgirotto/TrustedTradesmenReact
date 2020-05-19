import React, { Component } from "react";
import "./HomePage.css";

import Title from "../../components/UI/Title/Title";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
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
          <Card className="card">
            <span class="card-title">1</span>
            <Divider className="card-divider" variant="middle" />
            <FaUserCircle className="card-icon" size="60" />
            <p>CREATE AN ACCOUNT AND LOGIN</p>
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
          </Card>
          <Card className="card">
            <span class="card-title">2</span>
            <Divider className="card-divider" variant="middle" />
            <FaToolbox className="card-icon" size="60" />
            <p>SELECT A SERVICE AND SUBMIT A JOB REQUEST</p>
            <Button
              className="home-button"
              onClick={() => (window.location.href = "/services")}
              variant="contained"
              color="primary"
            >
              SERVICES
            </Button>
          </Card>
          <Card className="card">
            <span class="card-title">3</span>
            <Divider className="card-divider" variant="middle" />
            <FaMoneyBillWave className="card-icon" size="60" />
            <p>RECEIVE A QUOTE FROM ONE OF OUR QUALIFIED TRADESMEN</p>
          </Card>
        </div>
      </div>
    );
  }
}

export default HomePage;
