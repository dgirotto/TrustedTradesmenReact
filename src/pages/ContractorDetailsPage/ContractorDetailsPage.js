import React, { Component } from "react";
import Backdrop from "../../components/UI/Backdrop/Backdrop";
import Title from "../../components/UI/Title/Title";
import { FaLink, FaInstagram, FaLinkedin, FaFacebook, FaYoutube, FaPhone, FaAt, FaGlobeAmericas } from "react-icons/fa";

import Alert from "@material-ui/lab/Alert";

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
                    {this.state.contractorDetails.website ? (<a href={"https://" + this.state.contractorDetails.website} target="_blank" rel="noopener noreferrer" className="social-link"><FaLink size="22" /><span className="link-text">Website</span></a>) :
                        (<span className="social-link no-link"><FaLink size="22" /><span className="link-text">Website</span></span>)}
                    {this.state.contractorDetails.instagram ? (<a href={"https://" + this.state.contractorDetails.instagram} target="_blank" rel="noopener noreferrer" className="social-link"><FaInstagram size="24" /><span className="link-text">Instagram</span></a>) :
                        (<span className="social-link no-link"><FaInstagram size="24" /><span className="link-text">Instagram</span></span>)}
                    {this.state.contractorDetails.facebook ? (<a href={"https://" + this.state.contractorDetails.facebook} target="_blank" rel="noopener noreferrer" className="social-link"><FaFacebook size="24" /><span className="link-text">Facebook</span></a>) :
                        (<span className="social-link no-link"><FaFacebook size="24" /><span className="link-text">Facebook</span></span>)}
                    {this.state.contractorDetails.youtube ? (<a href={"https://" + this.state.contractorDetails.youtube} target="_blank" rel="noopener noreferrer" className="social-link"><FaYoutube size="24" color="#c4302b" /><span className="link-text">Youtube</span></a>) :
                        (<span className="social-link no-link"><FaYoutube size="24" /><span className="link-text">Youtube</span></span>)}
                    {this.state.contractorDetails.linkedin ? (<a href={"https://" + this.state.contractorDetails.linkedin} target="_blank" rel="noopener noreferrer" className="social-link"><FaLinkedin size="24" color="#0e76a8" /><span className="link-text">LinkedIn</span></a>) :
                        (<span className="social-link no-link"><FaLinkedin size="24" /><span className="link-text">LinkedIn</span></span>)}
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
                <Alert severity="info" color="info">
                    All contractors on TT will abide by the TT creed, “Great Job for a fair price”. All contractors will maintain honesty, integrity and quality of work.
                    Our contractors will have their work checked by a professional home inspector (certain jobs over $5000) to ensure everything was completed and nothing was missed. If the inspector finds problems, contractor will be notified as to what, ask why it was done and possible repairs to be done. The contractor will be given an opportunity to return to the job site and correct it. This will aid in helping larger (or smaller) contracting businesses to better manage their jobs to prevent mistakes and or missed items that could possibly cause damage to their property or reputation. Our inspectors are by no means out to create more work over and above what was quoted by contractors or to damage reputation. All of our Inspectors are veterans, understand construction very well, and understand the limitations contractors experience with materials and customers. Our inspectors are here to make you look better and improve your reputation and rating.
                    TT is not looking for the cheapest priced contractors, and are not looking for the most expensive, we want you to charge fair for what the job entails. TT wants all of our contractors to earn a good living and be paid what they deserve based on quality and type of work. TT wants this site to help contractors to easily obtain job leads that work within their area of coverage and that will fill voids in their schedule add nicely to their bottom line.
                    The contractor will only have to pay a consultation fee on jobs obtained and completed. There is no fee to be on the site or to possess an account. The jobs leads will be emailed to contractors with pertinent info of the job including client budget and will only be mailed out if it is within the agreed upon contractor coverage area. Contractors may decide to contact client and obtain more info or just decline job lead. TT will require the contractor to pay the consultation fee directly to TT on the lower priced jobs completed (see fee schedule below). Selected jobs over $5000 will be subjected to a 15% hold back and a check by a professional inspector within 2 weeks of job completion. Upon favourable check by inspector remaining funds will be released to contractor minus TTs fee. This fee is to be deposited into a TT holding account by the client prior to contractor starting job. This may also protect the contractor in the case where the client doesn’t fully pay the contractor what is owed, TT will forgo there fee and release the entire amount to the contractor and client will never be able to use TT site again.
                    All TT contractors will obtain proper permits for jobs, abide by Ontario building codes and be respectable to all clients. TT wants there site to be recognized by the older community as one that can be trusted to obtain reliable and quality contractors at any time, a site you would trust your parents to pick a contractor from.
                </Alert>
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



