import React, { Component } from "react";
import "./HomePage.css";
import Auxil from "../../helpers/Auxil";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import { FaUserPlus, FaFileContract, FaUsers, FaInstagram, FaLinkedin, FaFacebook, FaTwitter } from "react-icons/fa";

class HomePage extends Component {
  render() {
    return (
      <Auxil>
        <div className="intro-container">
          <h1 className="home-title">OUR MISSION</h1>
          <div className="intro">
            {/* <div className="intro-photo">
              <img src="https://www.oahi.com/_uploads/account_portrait/1861.jpg" alt="Chris Portrait" />
            </div> */}
            <div className="intro-desc">
              My name is Chris Willick. I've been a professional home inspector for over 20 years. I have seen my fair share of
              contracting jobs done incorrectly and witnessed many people get ripped off.<br /><br />
              I've designed a website that has only inspector-approved contractors. Most other sites with contractor ratings are from
              customers who may not be completely knowledgable about construction. Contractors at Trusted Tradesmen are rated by
              both the customer and professional inspectors, who are trusted!<br /><br />
              A great job for a fair price is my ultimate aim, by honest
              contractors with integrity and morale. They're definitely out there, and I'm finding more as I go.<br /><br />
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
              <Button
                className="home-button"
                onClick={() => (window.location.href = "/register")}
                variant="contained"
                color="primary"
              >
                REGISTER
              </Button>
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
              <p>Choose from one of our many qualified tradesmen</p>
            </Card>
          </div>
        </div>
        <div className="footer-container">
          <div className="footer-content">
            <a href="register" className="footer-link">Register</a>
            <a href="login" className="footer-link">Login</a>
            <a href="services" className="footer-link">Services</a>
          </div>
          <div className="footer-content">
            <a href="disclaimers" className="footer-link">Disclaimers</a>
            <a href="support" className="footer-link">Support</a>
            <a href="about" className="footer-link">About</a>
            <a href="faq" className="footer-link">FAQ</a>
          </div>
          <div style={{ paddingTop: "40px", textAlign: "center", color: "white" }}>
            <a href="https://www.instagram.com" target="blank" className="footer-link with-icon"><FaInstagram size="27" /></a>
            <a href="https://www.facebook.com" target="blank" className="footer-link with-icon"><FaFacebook size="27" /></a>
            <a href="https://www.twitter.com" target="blank" className="footer-link with-icon"><FaTwitter size="27" /></a>
            <a href="https://www.linkedin.com" target="blank" className="footer-link with-icon"><FaLinkedin size="27" /></a>
          </div>
          <p className="copyright-msg">Copyright © 2021 Trusted Tradesmen. All rights reserved.</p>
        </div>
      </Auxil >
    );
  }
}

export default HomePage;
