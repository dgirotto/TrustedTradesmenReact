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
            <div className="contractor-details-container">
                <Title>{this.state.contractorDetails.companyName.toUpperCase()}</Title>
                <span className="details-title">LINKS</span>
                <div className="links-container">
                    {this.state.contractorDetails.website ? (<a href={"https://" + this.state.contractorDetails.website} target="_blank" rel="noopener noreferrer" className="social-link"><FaLink size="22" /><span className="link-text">Website</span></a>) : null}
                    {this.state.contractorDetails.instagram ? (<a href={"https://" + this.state.contractorDetails.instagram} target="_blank" rel="noopener noreferrer" className="social-link"><FaInstagram size="24" /><span className="link-text">Instagram</span></a>) : null}
                    {this.state.contractorDetails.facebook ? (<a href={"https://" + this.state.contractorDetails.facebook} target="_blank" rel="noopener noreferrer" className="social-link"><FaFacebook size="24" /><span className="link-text">Facebook</span></a>) : null}
                    {this.state.contractorDetails.youtube ? (<a href={"https://" + this.state.contractorDetails.youtube} target="_blank" rel="noopener noreferrer" className="social-link"><FaYoutube size="24" color="#c4302b" /><span className="link-text">Youtube</span></a>) : null}
                    {this.state.contractorDetails.linkedin ? (<a href={"https://" + this.state.contractorDetails.linkedin} target="_blank" rel="noopener noreferrer" className="social-link"><FaLinkedin size="24" color="#0e76a8" /><span className="link-text">LinkedIn</span></a>) : null}
                </div>
                <div className="contractor-details">
                    <div className="contact-details-container">
                        <span className="details-title">CONTACT DETAILS</span>
                        <span className="contact-field"><FaPhone size="18" /><span>{this.state.contractorDetails.phone}</span></span>
                        <span className="contact-field"><FaAt size="18" /><span><a href={"mailto:" + this.state.contractorDetails.email}>{this.state.contractorDetails.email}</a></span></span>
                        <span className="contact-field"><FaGlobeAmericas size="18" /><span>{this.state.contractorDetails.city}, {this.state.contractorDetails.province}</span></span>
                    </div>
                    <div className="services-container">
                        <span className="details-title">SERVICES OFFERED</span>
                        <div className="service-list">
                            {this.state.contractorDetails.services.split(';').map((service, i) => (
                                <span key={i} className="service-item">{service}</span>
                            ))}
                        </div>
                    </div>
                    {this.state.contractorDetails.specials ? (
                        <div className="contractor-headline">
                            <span className="details-title">DEALS</span>
                            <span>{this.state.contractorDetails.specials}</span>
                        </div>) : null}
                    <div className="contractor-bio">
                        <span className="details-title">ABOUT</span>
                        <span>{this.state.contractorDetails.bio}</span>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className="contractor-details-page-container">
                {this.state.contractorDetails && this.renderContent()}
                {this.state.isLoading ? <Backdrop /> : null}
            </div>
        );
    }
}

export default ContractorDetailsPage;



