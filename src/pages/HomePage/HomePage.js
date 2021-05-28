import React, { Component } from "react";
import "./HomePage.css";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import { FaUserPlus, FaFileContract, FaUsers, FaInstagram, FaLinkedin, FaFacebook, FaTwitter } from "react-icons/fa";

class HomePage extends Component {
  render() {
    return (
      <>
        <div style={{
          background: `url('${process.env.PUBLIC_URL}/images/home-page-banner-2.jpg')`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          height: 350
        }}>
          <div className="banner-container">
            <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
              <div>
                FREE HOME INSPECTION FOR JOBS OVER $7,000!
                <Button
                  style={{
                    display: "block",
                    marginTop: "20px",
                    backgroundColor: "#263137",
                    color: "#fff",
                    fontWeight: "bold",
                    borderRadius: 0,
                    border: "solid #fff 2px"
                  }}
                  onClick={() => window.location.href = "/about"}
                  variant="contained"
                >
                  VIEW OUR SERVICES
                </Button>
              </div>
            </div>
            <div>
            </div>
          </div>
        </div>
        <div className="verbiage-container">
          <div>
            <h1>20</h1>
            <h3>Years helping and providing best Services</h3>
            My Name is Chris Willick. I've been a professional home inspector for over 20 years. I have seen my fair share of
            contracting jobs done incorrectly and witnessed many people getting ripped off.
            <Button
              style={{
                display: "block",
                marginTop: "20px",
                backgroundColor: "#fff",
                color: "#007cd2",
                fontWeight: "bold",
                borderRadius: 0,
                boxShadow: "none",
                border: "solid #007cd2 2px"
              }}
              onClick={() => window.location.href = "/about"}
              variant="contained"
            >
              READ MORE
            </Button>
          </div>
          <div style={{ textAlign: "right" }}>
            <img src={process.env.PUBLIC_URL + '/icons/img-building.svg'} />
          </div>
        </div>
        <div className="info-container">
          <h1 style={{ color: "#2B3F48" }} className="home-title">HOW IT WORKS</h1>
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
              {/* <Button
                className="home-button"
                onClick={() => (window.location.href = "/login")}
                variant="contained"
                color="primary"
              >
                LOGIN
              </Button> */}
            </Card>
            <Card className="card">
              <FaFileContract className="card-icon" size="60" />
              <p>Choose a service and submit a job request</p>
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
              <p>Get connected with one of our many qualified tradesmen, and we'll get to work!</p>
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
      </ >
    );
  }
}

export default HomePage;
