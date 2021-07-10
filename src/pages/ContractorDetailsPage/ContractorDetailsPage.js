import React, { Component } from "react";
import Backdrop from "../../components/UI/Backdrop/Backdrop";
import { FaLink, FaInstagram, FaLinkedin, FaFacebook, FaYoutube, FaPhone, FaAt } from "react-icons/fa";

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
                <div className="contractor-details-container">
                    <div className="contractor-profile-container">
                        <div className="profile-pic-container">
                            <img width="100%" src={process.env.PUBLIC_URL + '/images/thum-placeholder.jpg'} />
                        </div>
                        <div>
                            {this.state.contractorDetails.specials && (
                                <div className="specials-container">
                                    <h2 className="details-title">DEALS</h2>
                                    <div style={{ padding: "0 20px 15px", fontFamily: "'Open Sans', sans-serif", fontSize: "14px" }} className="multi-line-container">
                                        {this.state.contractorDetails.specials}
                                    </div>
                                </div>
                            )}
                            <div className="contact-details-container">
                                <h2 className="details-title orange">
                                    CONTACT DETAILS
                                </h2>
                                <div style={{ display: "flex", flexDirection: "column", padding: "15px 20px", fontFamily: "'Open Sans', sans-serif" }}>
                                    <span className="contact-field">Location: {this.state.contractorDetails.city}, {this.state.contractorDetails.province}</span>
                                    <span className="contact-field"><FaPhone size="18" /><span>{this.state.contractorDetails.phone}</span></span>
                                    <span className="contact-field"><FaAt size="18" /><span><a href={"mailto:" + this.state.contractorDetails.email}>{this.state.contractorDetails.email}</a></span></span>
                                </div>
                                <h2 className="details-title orange">
                                    LINKS
                                </h2>
                                <div style={{ display: "flex", padding: "15px" }}>
                                    {this.state.contractorDetails.instagram && (<a href={"https://" + this.state.contractorDetails.instagram} target="_blank" rel="noopener noreferrer" className="social-link"><FaInstagram size="23" /></a>)}
                                    {this.state.contractorDetails.facebook && (<a href={"https://" + this.state.contractorDetails.facebook} target="_blank" rel="noopener noreferrer" className="social-link"><FaFacebook size="23" /></a>)}
                                    {this.state.contractorDetails.youtube && (<a href={"https://" + this.state.contractorDetails.youtube} target="_blank" rel="noopener noreferrer" className="social-link"><FaYoutube size="23" /></a>)}
                                    {this.state.contractorDetails.linkedin && (<a href={"https://" + this.state.contractorDetails.linkedin} target="_blank" rel="noopener noreferrer" className="social-link"><FaLinkedin size="23" /></a>)}
                                    {this.state.contractorDetails.website && (<a href={"https://" + this.state.contractorDetails.website} target="_blank" rel="noopener noreferrer" className="social-link"><FaLink size="23" /></a>)}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="contractor-info-container">
                        <h1 style={{ margin: "0 0 10px", color: "#313131" }}>
                            {this.state.contractorDetails.companyName !== null ? this.state.contractorDetails.companyName : "COMPANY NAME"}
                        </h1>
                        <div style={{ fontFamily: "'Open Sans', sans-serif" }} className="multi-line-container">
                            {this.state.contractorDetails.bio}
                        </div>
                        <div className="services-offered-container">
                            <h2 style={{ margin: 0, fontSize: "22px", color: "#313131", fontFamily: "'Bebas Neue', sans-serif", fontWeight: "normal" }}>
                                SERVICES OFFERED
                            </h2>
                            <div className="service-list">
                                {this.state.contractorDetails.services.split(';').map((service, i) => (
                                    <span key={i} className="service-item">{service}</span>
                                ))}
                            </div>
                        </div>
                        {/* <div className="reviews-container">
                            <h1 style={{ margin: "0px 0px 10px", fontSize: "24px", color: "#313131" }}>
                                REVIEWS
                            </h1>
                            <div className="reviews">
                                <div className="review">REVIEW 1</div>
                                <div className="review">REVIEW 2</div>
                                <div className="review">REVIEW 3</div>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
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



