import React, { Component } from "react";
import "./HomePage.css";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import { FaInstagram, FaLinkedin, FaFacebook, FaTwitter } from "react-icons/fa";

import { ServicesService } from "../../services/service";

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      services: null,
      testimonials: [
        {
          image: '/images/thum-placeholder.jpg',
          content: `Text here text here text here text here text here text here text here text here text here text here text here
        text here text here text here text here text here text here text here text here text here text here text here text here text here text here
        text here text here`,
          name: 'John Smith',
          location: 'Oakville, ON'
        },
        {
          image: '/images/thum-placeholder.jpg',
          content: `testing testing testing testing testing testing testing testing testing testing testing testing testing testing testing 
          testing testing testing testing testing testing testing testing testing testing testing testing testing testing testing 
          testing testing testing testing testing testing`,
          name: 'Peter S',
          location: 'Windsor, ON'
        },
        {
          image: '/images/thum-placeholder.jpg',
          content: `1234 1234 1234 1234 1234 1234 TEST TEST TEST TEST`,
          name: 'Daniel G',
          location: 'Guelph, ON'
        }
      ],
      galleryPhotos: [
        '/images/img-roofing.jpg',
        '/images/img-flooring.jpg',
        '/images/img-welding.jpg',
        '/images/img-roofing.jpg',
        '/images/img-flooring.jpg',
        '/images/img-welding.jpg'
      ],
      testimonialCounter: 0,
      galleryCounter: 0,
      isError: false,
      message: ""
    };
  }

  componentDidMount() {
    ServicesService.getServices()
      .then(res => {
        this.setState({
          services: res.data.slice(0, 10)
        });
      })
      .catch(err => {
        console.error("Error while getting services: " + err.response);
      });
  }

  galleryArrowClickHandler(incrementCounter) {
    if (incrementCounter) {
      console.log('this.state.galleryCounter: ' + this.state.galleryCounter);
      console.log('this.state.galleryPhotos.length: ' + this.state.galleryPhotos.length);
      console.log('this.state.galleryCounter === this.state.galleryPhotos.length: ' + (this.state.galleryCounter === this.state.galleryPhotos.length));
      if (this.state.galleryCounter + 3 === this.state.galleryPhotos.length) {
        return;
      }
      this.setState({ galleryCounter: this.state.galleryCounter + 1 });
    } else {
      if (this.state.galleryCounter === 0) {
        return;
      }
      this.setState({ galleryCounter: this.state.galleryCounter - 1 });
    }
  }

  testimonialArrowClickHandler(incrementCounter) {
    if (incrementCounter) {
      if (this.state.testimonialCounter === this.state.testimonials.length - 1) {
        return;
      }
      this.setState({ testimonialCounter: this.state.testimonialCounter + 1 });
    } else {
      if (this.state.testimonialCounter === 0) {
        return;
      }
      this.setState({ testimonialCounter: this.state.testimonialCounter - 1 });
    }
  }

  serviceCardClickHandler = serviceId => {
    var service = this.state.services.filter(service => {
      return service.serviceId === serviceId
    });

    if (this.props.isAuth && this.props.userType === 0) {
      window.location.href = "/services/" + service[0].serviceId;
    }
    else {
      this.props.handleOpen(false);
    }
  };

  render() {
    return (
      <>
        <div style={{
          background: `url('${process.env.PUBLIC_URL}/images/home-page-banner-2.jpg')`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          height: 300
        }}>
          <div className="banner-container">
            <div style={{ display: "flex", alignItems: "center" }}>
              <div>
                <h1 style={{
                  padding: "10px",
                  fontFamily: "'Quicksand', sans-serif",
                  fontSize: "28px",
                  background: "#ffffff1f"
                }}>
                  FREE HOME INSPECTIONS FOR JOBS OVER $7,000
                </h1>
                <Button className="home-button"
                  style={{
                    display: "block",
                    marginTop: "20px",
                    backgroundColor: "#20292d",
                    color: "#fff",
                    fontWeight: "bold",
                    borderRadius: 0,
                    border: "solid #fff 2px",
                  }}
                  onClick={() => window.location.href = "/services"}
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
              <h1 style={{ margin: 0, fontFamily: "'Noto Sans', sans-serif", fontSize: "70px", color: "#545454" }}>20</h1>
              <h3 style={{ marginTop: "-10px", color: "#545454" }}>Years of inspecting, quality work, and seeking good contractors</h3>
              <p style={{ fontFamily: "'Open Sans', sans-serif" }}>
                My Name is Chris Willick. I've been a professional home inspector for over 20 years. I have seen my fair share of
                contracting jobs done incorrectly and witnessed many people getting ripped off.
              </p>
              <Button className="home-button"
                style={{
                  display: "block",
                  marginTop: "20px",
                  backgroundColor: "#fff",
                  color: "#e89600",
                  fontWeight: "bold",
                  borderRadius: 0,
                  boxShadow: "none",
                  border: "solid #e89600 2px"
                }}
                onClick={() => window.location.href = "/about"}
                variant="contained"
              >
                READ MORE
              </Button>
            </div>
          </div>
          <div className="img-container">
            <img style={{ width: "100%", maxWidth: "300px" }} src={process.env.PUBLIC_URL + '/icons/img-home-repair.svg'} />
          </div>
        </div>
        <div style={{ padding: "60px 0", background: "#EFEFEF" }}>
          <h1 style={{ margin: "20px 0 0", textAlign: "center", color: "#313131", fontFamily: "'Bebas Neue', sans-serif", fontSize: "38px" }}>
            <span style={{ borderStyle: "solid", borderWidth: "0 0 4px", borderColor: "#e89600" }}>HOW</span> IT WORKS
          </h1>
          <div className="card-container">
            <div className="card">
              <div>
                <img className="card-icon" src={process.env.PUBLIC_URL + '/icons/icon-register.svg'} />
                <p style={{ padding: "5px 0" }}>Create an account and login</p>
                <Button style={{
                  display: "block",
                  width: "120px",
                  margin: "0 auto",
                  border: "solid #fff 2px",
                  borderRadius: 0,
                  boxShadow: "none",
                  fontWeight: "bold",
                  backgroundColor: "#e89600",
                  color: "#fff"
                }}
                  onClick={() => this.props.handleOpen(true)}
                  variant="contained"
                  disabled={this.props.isAuth}
                >
                  REGISTER
                </Button>
                <Button style={{
                  width: "120px",
                  margin: "20px auto 0px",
                  border: "solid #fff 2px",
                  borderRadius: 0,
                  boxShadow: "none",
                  fontWeight: "bold",
                  backgroundColor: "#e89600",
                  color: "#fff"
                }}
                  onClick={() => this.props.handleOpen(false)}
                  variant="contained"
                  disabled={this.props.isAuth}
                >
                  LOGIN
                </Button>
              </div>
            </div>
            <div className="card">
              <div>
                <img className="card-icon" src={process.env.PUBLIC_URL + '/icons/icon-services.svg'} />
                <p style={{ padding: "5px 0" }}>Choose a service and submit a job request</p>
                <Button style={{
                  width: "120px",
                  margin: "0 auto",
                  border: "solid #fff 2px",
                  borderRadius: 0,
                  boxShadow: "none",
                  fontWeight: "bold",
                  backgroundColor: "#e89600",
                  color: "#fff",
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
                  margin: "0 auto",
                  border: "solid #fff 2px",
                  borderRadius: 0,
                  boxShadow: "none",
                  fontWeight: "bold",
                  backgroundColor: "#e89600",
                  color: "#fff"
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
          <h1 style={{ margin: "20px 0 0", textAlign: "center", color: "#313131", fontFamily: "'Bebas Neue', sans-serif", fontSize: "38px" }}>
            <span style={{ borderStyle: "solid", borderWidth: "0 0 4px", borderColor: "#e89600" }}>POPULAR</span> SERVICES
          </h1>
          <div className="services-container">
            <div className="services">
              {this.state.services && this.state.services.map(service => (
                <Card
                  className="service"
                  variant="outlined"
                  key={service.serviceId}
                  onClick={() => this.serviceCardClickHandler(service.serviceId)}
                >
                  <h2 className="service-title">
                    {service.serviceName.toUpperCase()}
                  </h2>
                </Card>
              ))}
            </div>
          </div>
        </div>
        <div style={{ padding: "50px 20px", background: "#20292d" }}>
          <h1 style={{ margin: "20px 0 0", textAlign: "center", color: "#fff", fontFamily: "'Bebas Neue', sans-serif", fontSize: "38px" }}>
            <span style={{ borderStyle: "solid", borderWidth: "0 0 4px", borderColor: "#fff" }}>OUR</span> WORK
          </h1>
          <div className="gallery-container">
            <div style={{ display: "flex", alignItems: "center", width: "35px" }}>
              <img
                className={this.state.galleryCounter === 0 ? "disabled-arrow" : "arrow"}
                onClick={() => this.galleryArrowClickHandler(false)} width="20px" src={process.env.PUBLIC_URL + '/icons/icon-arrow-left.svg'}
              />
            </div>
            <div className="gallery-main">
              <div className="gallery-card a">
                <img style={{ maxWidth: "100%", maxHeight: "100%" }} src={process.env.PUBLIC_URL + this.state.galleryPhotos[this.state.galleryCounter]} />
              </div>
              <div className="gallery-card b">
                <img width="100%" src={process.env.PUBLIC_URL + this.state.galleryPhotos[this.state.galleryCounter + 1]} />
              </div>
              <div className="gallery-card c">
                <img width="100%" src={process.env.PUBLIC_URL + this.state.galleryPhotos[this.state.galleryCounter + 2]} />
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", width: "35px", justifyContent: "flex-end" }}>
              <img
                className={this.state.galleryCounter === (this.state.galleryPhotos.length - 3) ? "disabled-arrow" : "arrow"}
                onClick={() => this.galleryArrowClickHandler(true)} width="20px" src={process.env.PUBLIC_URL + '/icons/icon-arrow-right.svg'}
              />
            </div>
          </div>
        </div>
        <div style={{ padding: "50px 20px" }}>
          <h1 style={{ margin: "20px 0 0", textAlign: "center", color: "#313131", fontFamily: "'Bebas Neue', sans-serif", fontSize: "38px" }}>
            <span style={{ borderStyle: "solid", borderWidth: "0 0 4px", borderColor: "#e89600" }}>WHAT</span> OUR CLIENTS SAY
          </h1>
          <div className="testimonial-container">
            <div style={{ display: "flex", alignItems: "center", width: "50px" }}>
              <img
                className={this.state.testimonialCounter === 0 ? "disabled-arrow" : "arrow"}
                onClick={() => this.testimonialArrowClickHandler(false)} width="35px" src={process.env.PUBLIC_URL + '/icons/icon-left-arrow.svg'}
              />
            </div>
            <div className="testimonial-main">
              <div className="testimonial-pic">
                <img width="100%" src={process.env.PUBLIC_URL + this.state.testimonials[this.state.testimonialCounter].image} />
              </div>
              <div className="testimonial-content">
                <img width="40px" src={process.env.PUBLIC_URL + '/icons/icon-quotes.svg'} />
                <p>
                  {this.state.testimonials[this.state.testimonialCounter].content}
                </p>
                <h1 style={{ fontSize: "20px", marginBottom: "0" }}>
                  {this.state.testimonials[this.state.testimonialCounter].name}
                </h1>
                <h2 style={{ fontSize: "14px", marginTop: "5px" }}>
                  {this.state.testimonials[this.state.testimonialCounter].location}
                </h2>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", width: "50px", justifyContent: "flex-end" }}>
              <img
                className={this.state.testimonialCounter === (this.state.testimonials.length - 1) ? "disabled-arrow" : "arrow"}
                onClick={() => this.testimonialArrowClickHandler(true)} width="35px" src={process.env.PUBLIC_URL + '/icons/icon-right-arrow.svg'}
              />
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
      </>
    );
  }
}

export default HomePage;
