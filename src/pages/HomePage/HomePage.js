import React, { Component } from "react";
import "./HomePage.css";
import Aux from "../../helpers/Aux";
import Title from "../../components/UI/Title/Title";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import Divider from "@material-ui/core/Divider";
import {
  FaCheck,
  FaUserCircle,
  FaToolbox,
  FaMoneyBillWave
} from "react-icons/fa";

class HomePage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Aux>
        <div className="intro-container">
          <div className="intro">
            <div className="intro-top">
              <Title>OUR MISSION</Title>
            </div>
            <div className="intro-bottom">
              <div className="intro-photo">
                <img src="https://www.oahi.com/_uploads/account_portrait/1861.jpg" />
              </div>
              <div className="intro-desc">
                Hello!
                <br />
                <br />
                My name is Chris Willick. I've been a professional home
                inspector for over 20 years. I've seen my fair share of bad jobs
                done over the years so I've developed a site which will solve
                your issues with home inspections. This is the only site where
                you'll see ratings by a contractor, and you'll also receive a
                rating from a qualified inspector who's also seen the job.
                <br />
                <br />
                Get started today!
              </div>
            </div>
          </div>
        </div>
        <div className="home-container">
          <br />
          <Title>HOW IT WORKS</Title>
          <div className="card-container">
            <Card className="card">
              <span className="card-title">1</span>
              <Divider className="card-divider" variant="middle" />
              <FaUserCircle className="card-icon" size="60" />
              <p>CREATE AN ACCOUNT AND LOGIN</p>
              {!this.props.isAuth ? (
                <Aux>
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
                </Aux>
              ) : (
                <FaCheck className="card-icon-check" size="45" />
              )}
            </Card>
            <Card className="card">
              <span className="card-title">2</span>
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
              <span className="card-title">3</span>
              <Divider className="card-divider" variant="middle" />
              <FaMoneyBillWave className="card-icon" size="60" />
              <p>RECEIVE A QUOTE FROM ONE OF OUR QUALIFIED TRADESMEN</p>
            </Card>
          </div>
          {/* <br />
          <Title>WHAT'S IN IT FOR YOU?</Title> */}
        </div>
      </Aux>
    );
  }
}

export default HomePage;
