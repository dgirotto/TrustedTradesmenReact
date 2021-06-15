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
                        marginBottom: "30px"
                    }}>
                        <div className="title-container">
                            <h1 style={{ margin: 0, color: "white" }}>
                                {this.state.contractorDetails.companyName !== null ? this.state.contractorDetails.companyName.toUpperCase() : "CONTRACTOR PROFILE"}
                            </h1>
                        </div>
                    </div>
                    <div className="contractor-details-container">
                        <div style={{ display: "flex", flexDirection: "column", width: "250px", marginRight: "20px" }}>
                            <div style={{ width: "250px" }}>
                                <img width="100%" src="user.png" />
                            </div>
                            {this.state.contractorDetails.specials && (
                                <div style={{ marginTop: "20px", padding: "15px", borderRadius: "3px", background: "#2086D1", color: "white" }}>
                                    <h2 style={{ margin: "0 0 10px", fontSize: "18px" }}>DEALS</h2>
                                    <div style={{ fontSize: "14px" }} className="multi-line-container">{this.state.contractorDetails.specials}</div>
                                </div>
                            )}
                        </div>

                        <div style={{ display: "flex", flex: 1, flexDirection: "column" }}>
                            <h1 style={{ margin: "0 0 10px", color: "#2086d1" }}>Contractor Name</h1>
                            <div className="multi-line-container">{this.state.contractorDetails.bio}</div>
                            <div style={{ marginTop: "20px", padding: "15px", borderRadius: "3px", background: "#f1f1f1" }}>
                                <h2 style={{ margin: "0 0 10px", fontSize: "18px" }}>SERVICES OFFERED</h2>
                                <div className="service-list">
                                    {this.state.contractorDetails.services.split(';').map((service, i) => (
                                        <span key={i} className="service-item">{service}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", width: "250px", maxHeight: "255px", marginLeft: "20px", paddingTop: "20px", background: "#263137", color: "white" }}>
                            <h2 style={{ margin: 0, padding: "10px 20px", fontSize: "18px", background: "#2086D1" }}>CONTACT DETAILS</h2>
                            <div style={{ display: "flex", flexDirection: "column", padding: "15px 20px" }}>
                                <span className="contact-field">Location: {this.state.contractorDetails.city}, {this.state.contractorDetails.province}</span>
                                <span className="contact-field"><FaPhone size="18" /><span>{this.state.contractorDetails.phone}</span></span>
                                <span className="contact-field"><FaAt size="18" /><span><a href={"mailto:" + this.state.contractorDetails.email}>{this.state.contractorDetails.email}</a></span></span>
                            </div>
                            <h2 style={{ margin: 0, padding: "10px 20px", fontSize: "18px", background: "#2086D1" }}>LINKS</h2>
                            <div style={{ padding: "15px 20px" }}>
                                <div style={{ display: "flex" }}>
                                    {this.state.contractorDetails.instagram && (<a href={"https://" + this.state.contractorDetails.instagram} target="_blank" rel="noopener noreferrer" className="social-link"><FaInstagram size="23" /></a>)}
                                    {this.state.contractorDetails.facebook && (<a href={"https://" + this.state.contractorDetails.facebook} target="_blank" rel="noopener noreferrer" className="social-link"><FaFacebook size="23" /></a>)}
                                    {this.state.contractorDetails.youtube && (<a href={"https://" + this.state.contractorDetails.youtube} target="_blank" rel="noopener noreferrer" className="social-link"><FaYoutube size="23" /></a>)}
                                    {this.state.contractorDetails.linkedin && (<a href={"https://" + this.state.contractorDetails.linkedin} target="_blank" rel="noopener noreferrer" className="social-link"><FaLinkedin size="23" /></a>)}
                                    {this.state.contractorDetails.website && (<a href={"https://" + this.state.contractorDetails.website} target="_blank" rel="noopener noreferrer" className="social-link"><FaLink size="23" /></a>)}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <h1>REVIEWS</h1>
                        <div className="reviews-container">
                            <div style={{ flex: 1, padding: "20px 0" }}>REVIEW 1</div>
                            <div style={{ flex: 1, padding: "20px 0" }}>REVIEW 2</div>
                            <div style={{ flex: 1, padding: "20px 0" }}>REVIEW 3</div>
                        </div>
                    </div>
                </div>
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



