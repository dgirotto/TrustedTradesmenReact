import React, { Component } from "react";
import "./HomePage.css";
import Auxil from "../../helpers/Auxil";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import { FaCheck, FaUserPlus, FaFileContract, FaUsers } from "react-icons/fa";

class HomePage extends Component {
  render() {
    return (
      <Auxil>
        <div className="intro-container">
          <h1 className="home-title">OUR MISSION</h1>
          <div className="intro">
            <div className="intro-photo">
              <img src="https://www.oahi.com/_uploads/account_portrait/1861.jpg" alt="Chris Portrait" />
            </div>
            <div className="intro-desc">
              Hello!<br /><br />
              My name is Chris Willick. I've been a professional home
              inspector for over 20 years. I've seen my fair share of bad jobs
              done over the years so I've developed a site which will solve
              your issues with home inspections. This is the only site where
              you'll see ratings by a contractor, and you'll also receive a
              rating from a qualified inspector who's also seen the job.<br /><br />
              Get started today!
            </div>
          </div>
        </div>
        <div className="info-container">
          <h1 className="home-title">HOW IT WORKS</h1>
          <div className="card-container">
            <Card className="card">
              <FaUserPlus className="card-icon" size="60" />
              <p>Create an account and login</p>
              {!this.props.isAuth || this.props.userType !== 0 ? (
                <Auxil>
                  <Button
                    className="home-button"
                    onClick={() => (window.location.href = "/register")}
                    variant="contained"
                    color="primary"
                  >
                    REGISTER
                  </Button>
                  <span>or</span>
                  <Button
                    className="home-button"
                    onClick={() => (window.location.href = "/login")}
                    variant="contained"
                    color="primary"
                  >
                    LOGIN
                  </Button>
                </Auxil>
              ) : (
                  <FaCheck className="card-icon-check" size="45" />
                )}
            </Card>
            <Card className="card">
              <FaFileContract className="card-icon" size="60" />
              <p>Select a service and submit a job request</p>
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
              <FaUsers className="card-icon" size="60" />
              <p>Choose from one of our qualified tradesmen</p>
            </Card>
          </div>
        </div>
        <div className="footer-container">
          <div className="footer-content">
          </div>
        </div>
      </Auxil>
    );
  }
}

export default HomePage;
