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
              Hello,<br /><br />My name is Chris Willick. I've been a professional home inspector for over 20 years. I've seen my fair share of bad jobs
              done over the years so I've developed a site which will solve your issues with home inspections. This is the only site where you'll see ratings
              by a contractor, and you'll also receive a rating from a qualified inspector who's also seen the job.<br /><br />Get started today!
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
            <div>
              {/* <div className="footer-title">SOCIALS</div> */}
              <ul className="footer-list">
                <li><a href="https://www.instagram.com" target="blank" className="footer-link with-icon"><FaInstagram className="social-icon" size="16" /><span>Instagram</span></a></li>
                <li><a href="https://www.facebook.com" target="blank" className="footer-link with-icon"><FaFacebook className="social-icon" size="16" /><span>Facebook</span></a></li>
                <li><a href="https://www.twitter.com" target="blank" className="footer-link with-icon"><FaTwitter className="social-icon" size="16" /><span>Twitter</span></a></li>
                <li><a href="https://www.linkedin.com" target="blank" className="footer-link with-icon"><FaLinkedin className="social-icon" size="16" /><span>LinkedIn</span></a></li>
              </ul>
            </div>
            <div>
              {/* <div className="footer-title">DISCLAIMERS</div> */}
              <ul className="footer-list">
                <li><a href="disclaimers" className="footer-link">Customer Disclaimer</a></li>
                <li><a href="disclaimers" className="footer-link">Contractor Disclaimer</a></li>
              </ul>
            </div>
            <div>
              <ul className="footer-list">
                <li><a href="register" className="footer-link">Register</a></li>
                <li><a href="login" className="footer-link">Login</a></li>
                <li><a href="services" className="footer-link">Services</a></li>
              </ul>
            </div>
            <div>
              <ul className="footer-list">
                <li><a href="support" className="footer-link">Support</a></li>
                <li><a href="about" className="footer-link">About</a></li>
                <li><a href="faq" className="footer-link">FAQ</a></li>
              </ul>
            </div>
          </div>
          <p className="copyright-msg">Copyright © 2020 Trusted Tradesmen. All rights reserved.</p>
        </div>
      </Auxil>
    );
  }
}

export default HomePage;
