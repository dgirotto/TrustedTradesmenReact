import React, { Component } from "react";
import Auxil from "../../helpers/Auxil";
import Backdrop from "../../components/UI/Backdrop/Backdrop";
import Title from "../../components/UI/Title/Title";
import { VscAccount } from "react-icons/vsc";
import { FaLink, FaInstagram, FaLinkedin, FaFacebook, FaYoutube } from "react-icons/fa";

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
                <Title>{this.state.contractorDetails.firstName.toUpperCase()} {this.state.contractorDetails.lastName.toUpperCase()}</Title>
                <div className="links-container">
                    {this.state.contractorDetails.website ? (<a href={"https://" + this.state.contractorDetails.website} target="_blank" className="social-link"><FaLink size="25" /><span className="link-text">Website</span></a>) : (<span className="social-link no-link"><FaLink size="25" /><span className="link-text">Website</span></span>)}
                    {this.state.contractorDetails.instagram ? (<a href={"https://" + this.state.contractorDetails.instagram} target="_blank" className="social-link"><FaInstagram size="25" /><span className="link-text">Instagram</span></a>) : (<span className="social-link no-link"><FaInstagram size="25" /><span className="link-text">Instagram</span></span>)}
                    {this.state.contractorDetails.facebook ? (<a href={"https://" + this.state.contractorDetails.facebook} target="_blank" className="social-link"><FaFacebook size="25" color="#4267B2" /><span className="link-text">Facebook</span></a>) : (<span className="social-link no-link"><FaFacebook size="25" /><span className="link-text">Facebook</span></span>)}
                    {this.state.contractorDetails.youtube ? (<a href={"https://" + this.state.contractorDetails.youtube} target="_blank" className="social-link"><FaYoutube size="25" color="#c4302b" /><span className="link-text">Youtube</span></a>) : (<span className="social-link no-link"><FaYoutube size="25" /><span className="link-text">Youtube</span></span>)}
                    {this.state.contractorDetails.linkedin ? (<a href={"https://" + this.state.contractorDetails.linkedin} target="_blank" className="social-link"><FaLinkedin size="25" color="#0e76a8" /><span className="link-text">LinkedIn</span></a>) : (<span className="social-link no-link"><FaLinkedin size="25" /><span className="link-text">LinkedIn</span></span>)}
                </div>
                <div className="contractor-details">
                    <div className="profile-image-container">
                        <VscAccount size="180" color="#e0e0e0" />
                    </div>
                    <div className="contact-details-container">
                        <span>Phone<br />{this.state.contractorDetails.phone}</span>
                        <span>Email<br />{this.state.contractorDetails.email}</span>
                        <span>Location<br />{this.state.contractorDetails.city}, {this.state.contractorDetails.province}</span>
                    </div>
                    <div className="services-container">
                        <span>Services Offered</span>
                    </div>
                </div>
                <div className="contractor-bio"><p>{this.state.contractorDetails.bio}</p></div>
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



