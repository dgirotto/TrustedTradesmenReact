import React, { Component } from "react";
import "./HomePage.css";
import Button from "@material-ui/core/Button";
import { FaInstagram, FaLinkedin, FaFacebook, FaTwitter } from "react-icons/fa";

class HomePage extends Component {
  render() {
    return (
      <>
        <div className="main-menu">
          <img height="100%" src={process.env.PUBLIC_URL + '/images/logo-no-text.png'} />
          <div>
            OTHER LINKS
          </div>
        </div>
        <div style={{
          background: `url('${process.env.PUBLIC_URL}/images/home-page-banner-2.jpg')`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          height: 350
        }}>
          <div className="banner-container">
            <div style={{ display: "flex", alignItems: "center" }}>
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
          <div style={{ display: "flex", alignItems: "center" }}>
            <div>
              <h1 style={{ margin: 0 }}>20</h1>
              <h3>Years helping and providing best Services</h3>
              My Name is Chris Willick. I've been a professional home inspector for over 20 years. I have seen my fair share of
              contracting jobs done incorrectly and witnessed many people getting ripped off.
              <Button style={{
                display: "block",
                marginTop: "20px",
                backgroundColor: "#fff",
                color: "#0097ff",
                fontWeight: "bold",
                borderRadius: 0,
                boxShadow: "none",
                border: "solid #0097ff 2px"
              }}
                onClick={() => window.location.href = "/about"}
                variant="contained"
              >
                READ MORE
              </Button>
            </div>
          </div>
          <div className="img-container">
            <img src={process.env.PUBLIC_URL + '/icons/img-building.svg'} />
          </div>
        </div>
        <div style={{ padding: "60px 0", background: "#EFEFEF" }}>
          <h1 style={{ margin: "20px 0 0", textAlign: "center", color: "#313131" }}>
            <span style={{ borderStyle: "solid", borderWidth: "0 0 4px", borderColor: "#2086D1" }}>HOW</span> IT WORKS
          </h1>
          <div className="card-container">
            <div className="card">
              <div>
                <img className="card-icon" src={process.env.PUBLIC_URL + '/icons/icon-register.svg'} />
                <p style={{ padding: "5px 0" }}>Create an account and login</p>
                <Button style={{
                  marginTop: "20px",
                  backgroundColor: "#fff",
                  color: "#0097ff",
                  fontWeight: "bold",
                  borderRadius: 0,
                  boxShadow: "none",
                  border: "solid #0097ff 2px",
                  width: "auto",
                  margin: "0 auto"
                }}
                  onClick={() => window.location.href = "/register"}
                  variant="contained"
                >
                  REGISTER
                </Button>
              </div>
            </div>
            <div className="card">
              <div>
                <img className="card-icon" src={process.env.PUBLIC_URL + '/icons/icon-services.svg'} />
                <p style={{ padding: "5px 0" }}>Choose a service and submit a job request</p>
                <Button style={{
                  marginTop: "20px",
                  backgroundColor: "#fff",
                  color: "#0097ff",
                  fontWeight: "bold",
                  borderRadius: 0,
                  boxShadow: "none",
                  border: "solid #0097ff 2px",
                  width: "auto",
                  margin: "0 auto"
                }}
                  onClick={() => window.location.href = "/services"}
                  variant="contained"
                >
                  SERVICES
                </Button>
              </div>
            </div>
            <div className="card">
              <div>
                <img className="card-icon" src={process.env.PUBLIC_URL + '/icons/icon-hire-a-professional.svg'} />
                <p style={{ padding: "5px 0" }}>Get connected with one of our many qualified tradesmen, and we'll get to work!</p>
                <Button style={{
                  marginTop: "20px",
                  backgroundColor: "#fff",
                  color: "#0097ff",
                  fontWeight: "bold",
                  borderRadius: 0,
                  boxShadow: "none",
                  border: "solid #0097ff 2px",
                  width: "auto",
                  margin: "0 auto"
                }}
                  onClick={() => window.location.href = "/services"}
                  variant="contained"
                >
                  HIRE A PROFESSIONAL
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div style={{ padding: "50px 20px" }}>
          <h1 style={{ margin: "20px 0 0", textAlign: "center", color: "#313131" }}>
            <span style={{ borderStyle: "solid", borderWidth: "0 0 4px", borderColor: "#2086D1" }}>OUR</span> SERVICES
          </h1>
          <div className="services-container">
          </div>
        </div>
        <div style={{ padding: "50px 20px", background: "#263137" }}>
          <h1 style={{ margin: "20px 0 0", textAlign: "center", color: "#fff" }}>
            <span style={{ borderStyle: "solid", borderWidth: "0 0 4px", borderColor: "#fff" }}>OUR</span> WORK
          </h1>
          <div className="gallery-container">
            <div style={{ display: "flex", alignItems: "center", width: "60px" }}>
              <img width="35px" src={process.env.PUBLIC_URL + '/icons/icon-left-arrow-white.svg'} />
            </div>
            <div className="gallery-main">
              <div className="gallery-card">1</div>
              <div className="gallery-card">2</div>
              <div className="gallery-card">3</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", width: "60px", justifyContent: "flex-end" }}>
              <img width="35px" src={process.env.PUBLIC_URL + '/icons/icon-right-arrow-white.svg'} />
            </div>
          </div>
        </div>
        <div style={{ padding: "50px 20px" }}>
          <h1 style={{ margin: "20px 0 0", textAlign: "center", color: "#313131" }}>
            <span style={{ borderStyle: "solid", borderWidth: "0 0 4px", borderColor: "#2086D1" }}>WHAT</span> OUR CLIENTS SAY
          </h1>
          <div className="testimonial-container">
            <div style={{ display: "flex", alignItems: "center", width: "60px" }}>
              <img width="35px" src={process.env.PUBLIC_URL + '/icons/icon-left-arrow.svg'} />
            </div>
            <div className="testimonial-main">
              <div className="testimonial-pic">
                <img width="100%" src={process.env.PUBLIC_URL + '/images/img-user.jpg'} />
              </div>
              <div style={{ width: "55%", padding: "30px 0 30px 25px" }}>
                <img width="40px" src={process.env.PUBLIC_URL + '/icons/icon-quotes.svg'} />
                <p>
                  Text here text here text here text here text here text here text here text here text here text here text here
                  text here text here text here text here text here text here text here text here text here text here text here text here text here text here
                  text here text here
                </p>
                <h1 style={{ fontSize: "20px", marginBottom: "0" }}>John Smith</h1>
                <h2 style={{ fontSize: "14px", marginTop: "5px" }}>OAKVILLE, ON</h2>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", width: "60px", justifyContent: "flex-end" }}>
              <img width="35px" src={process.env.PUBLIC_URL + '/icons/icon-right-arrow.svg'} />
            </div>
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
