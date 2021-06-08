import React, { Component } from "react";
import Backdrop from "../../components/UI/Backdrop/Backdrop";
import Title from "../../components/UI/Title/Title";
import { FaLink, FaInstagram, FaLinkedin, FaFacebook, FaYoutube, FaPhone, FaAt, FaGlobeAmericas } from "react-icons/fa";

import "./ContractorDetailsPage.css";

import { AccountService } from "../../services/account";

class ContractorDetailsPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            contractorDetails: null,
            isLoading: false
        };
    }

    componentDidMount() {
        this.setState({ isLoading: true });

        AccountService.getContractorDetails(this.props.match.params.id)
            .then(res => {
                this.setState({
                    contractorDetails: res.data,
                    isLoading: false
                });
            })
            .catch(err => {
                console.error("Error while getting contractor details" + err.response);
            });
    }

    renderContent() {
        return (
            <div className="page-container">
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <div style={{
                        background: `url('${process.env.PUBLIC_URL}/images/home-page-banner-2.jpg')`,
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                        height: 150,
                        marginBottom: "40px"
                    }}>
                        <div className="title-container">
                            <h1 style={{ margin: 0, color: "white" }}>
                                {this.state.contractorDetails.companyName !== null ? this.state.contractorDetails.companyName.toUpperCase() : "CONTRACTOR PROFILE"}
                            </h1>
                        </div>
                    </div>

                    <div style={{ display: "flex" }}>
                        <div style={{ display: "flex", flexDirection: "column", width: "250px", marginRight: "20px" }}>
                            <div style={{ width: "250px" }}>
                                <img width="100%" src="user.png" />
                            </div>
                            {this.state.contractorDetails.specials && (
                                <div style={{ padding: "10px", background: "#2086D1", color: "white" }}>
                                    <h2 style={{ margin: 0 }}>DEALS</h2>
                                    <div className="multi-line-container">{this.state.contractorDetails.specials}</div>
                                </div>
                            )}
                        </div>

                        <div style={{ display: "flex", flex: 1, flexDirection: "column" }}>
                            <h1>Contractor Name</h1>
                            <div className="multi-line-container">{this.state.contractorDetails.bio}</div>
                            <div>
                                <h2>SERVICES OFFERED</h2>
                                <div className="service-list">
                                    {this.state.contractorDetails.services.split(';').map((service, i) => (
                                        <span key={i} className="service-item">{service}</span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", width: "250px", marginLeft: "20px", paddingTop: "20px", background: "#263137", color: "white" }}>
                            <h2 style={{ margin: 0, padding: "10px 20px", background: "#2086D1" }}>CONTACT DETAILS</h2>
                            <div style={{ display: "flex", flexDirection: "column", padding: "15px 20px" }}>
                                <span className="contact-field">Location: {this.state.contractorDetails.city}, {this.state.contractorDetails.province}</span>
                                <span className="contact-field"><FaPhone size="18" /><span>{this.state.contractorDetails.phone}</span></span>
                                <span className="contact-field"><FaAt size="18" /><span><a href={"mailto:" + this.state.contractorDetails.email}>{this.state.contractorDetails.email}</a></span></span>
                            </div>
                            <h2 style={{ margin: 0, padding: "5px 20px", background: "#2086D1" }}>LINKS</h2>
                            <div style={{ padding: "15px 20px" }}>
                                LINKS HERE
                            </div>
                        </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <h1>REVIEWS</h1>
                        <div style={{ display: "flex" }}>
                            <div style={{ flex: 1, padding: "20px 0" }}>REVIEW 1</div>
                            <div style={{ flex: 1, padding: "20px 0" }}>REVIEW 2</div>
                            <div style={{ flex: 1, padding: "20px 0" }}>REVIEW 3</div>
                        </div>
                    </div>
                </div>

                {/* <span className="details-title">Links</span>
                <div className="links-container">
                    {this.state.contractorDetails.website && (<a href={"https://" + this.state.contractorDetails.website} target="_blank" rel="noopener noreferrer" className="social-link"><FaLink size="22" /><span>Website</span></a>)}
                    {this.state.contractorDetails.instagram && (<a href={"https://" + this.state.contractorDetails.instagram} target="_blank" rel="noopener noreferrer" className="social-link"><FaInstagram size="24" /><span>Instagram</span></a>)}
                    {this.state.contractorDetails.facebook && (<a href={"https://" + this.state.contractorDetails.facebook} target="_blank" rel="noopener noreferrer" className="social-link"><FaFacebook size="24" /><span>Facebook</span></a>)}
                    {this.state.contractorDetails.youtube && (<a href={"https://" + this.state.contractorDetails.youtube} target="_blank" rel="noopener noreferrer" className="social-link"><FaYoutube size="24" color="#c4302b" /><span>Youtube</span></a>)}
                    {this.state.contractorDetails.linkedin && (<a href={"https://" + this.state.contractorDetails.linkedin} target="_blank" rel="noopener noreferrer" className="social-link"><FaLinkedin size="24" color="#0e76a8" /><span>LinkedIn</span></a>)}
                </div>
                <div className="contractor-details">
                    <div className="contact-details-container">
                        <span className="details-title">Contact Details</span>
                        <span className="contact-field"><FaPhone size="18" /><span>{this.state.contractorDetails.phone}</span></span>
                        <span className="contact-field"><FaAt size="18" /><span><a href={"mailto:" + this.state.contractorDetails.email}>{this.state.contractorDetails.email}</a></span></span>
                        <span className="contact-field"><FaGlobeAmericas size="18" /><span>{this.state.contractorDetails.city}, {this.state.contractorDetails.province}</span></span>
                    </div>
                    <div className="services-container">
                        <span className="details-title">Services Offered</span>
                        <div className="service-list">
                            {this.state.contractorDetails.services.split(';').map((service, i) => (
                                <span key={i} className="service-item">{service}</span>
                            ))}
                        </div>
                    </div>
                    {this.state.contractorDetails.specials && (
                        <div className="contractor-headline">
                            <span className="details-title">Deals</span>
                            <div className="multi-line-container">{this.state.contractorDetails.specials}</div>
                        </div>)}
                    <div className="contractor-bio">
                        <span className="details-title">About</span>
                        <div className="multi-line-container">{this.state.contractorDetails.bio}</div>
                    </div>
                </div> */}
            </div >
        );
    }

    render() {
        return (
            <>
                {this.state.contractorDetails && this.renderContent()}
                {this.state.isLoading && <Backdrop />}
            </>
        );
    }
}

export default ContractorDetailsPage;



