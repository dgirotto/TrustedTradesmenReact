import React, { Component } from "react";
import { hasRequiredFields, hasExtraFields } from '../helpers/Utils';
import { FaCheck, FaTimes } from "react-icons/fa";
import Button from "@material-ui/core/Button";

export default class Instructions extends Component {
    render() {
        return (
            <>
                {!hasRequiredFields(this.props.contractorDetails) && (
                    <>
                        <div style={{ marginBottom: "10px" }}>Before you can receive any jobs (or leads), you must fill out the following fields:</div>
                        <span className="item-with-icon" style={{ paddingBottom: "5px" }}>
                            {this.props.contractorDetails.firstName && this.props.contractorDetails.lastName ? <FaCheck className="item-icon green" /> : <FaTimes className="item-icon red" />}
                            Full Name
                        </span>
                        <span className="item-with-icon" style={{ paddingBottom: "5px" }}>
                            {this.props.contractorDetails.phone ? <FaCheck className="item-icon green" /> : <FaTimes className="item-icon red" />}
                            Phone Number
                        </span>
                        <span className="item-with-icon" style={{ paddingBottom: "5px" }}>
                            {this.props.contractorDetails.address ? <FaCheck className="item-icon green" /> : <FaTimes className="item-icon red" />}
                            Address
                        </span>
                        <span className="item-with-icon" style={{ paddingBottom: "5px" }}>
                            {this.props.contractorDetails.city ? <FaCheck className="item-icon green" /> : <FaTimes className="item-icon red" />}
                            City
                        </span>
                        <span className="item-with-icon" style={{ paddingBottom: "5px" }}>
                            {this.props.contractorDetails.postalCode ? <FaCheck className="item-icon green" /> : <FaTimes className="item-icon red" />}
                            Postal Code
                        </span>
                        <span className="item-with-icon" style={{ paddingBottom: "5px" }}>
                            {this.props.contractorDetails.maxDistance ? <FaCheck className="item-icon green" /> : <FaTimes className="item-icon red" />}
                            Travel Distance
                        </span>
                        <span className="item-with-icon" style={{ paddingBottom: "5px" }}>
                            {this.props.contractorDetails.services ? <FaCheck className="item-icon green" /> : <FaTimes className="item-icon red" />}
                            Services
                        </span>
                    </>
                )}
                {!hasExtraFields(this.props.contractorDetails) && (
                    <>
                        <div style={{ margin: "15px 0 10px" }}>
                            The following fields will help bolster your <a href={"/contractors/" + this.props.contractorDetails.userId}>profile page</a>. Filling these
                            out gives your client a better idea of who you are and the skills you're capable of providing.
                        </div>
                        <span className="item-with-icon" style={{ paddingBottom: "5px" }}>
                            {this.props.contractorDetails.bio ? <FaCheck className="item-icon green" /> : <FaTimes className="item-icon red" />}
                            Bio
                        </span>
                        <span className="item-with-icon" style={{ paddingBottom: "5px" }}>
                            {this.props.contractorDetails.photo ? <FaCheck className="item-icon green" /> : <FaTimes className="item-icon red" />}
                            Photo
                        </span>
                        <span className="item-with-icon" style={{ paddingBottom: "5px" }}>
                            {(this.props.contractorDetails.linkedin
                                || this.props.contractorDetails.facebook
                                || this.props.contractorDetails.youtube
                                || this.props.contractorDetails.instagram) ? <FaCheck className="item-icon green" /> : <FaTimes className="item-icon red" />}
                            Social Media Links
                        </span>
                        <span className="item-with-icon" style={{ paddingBottom: "5px" }}>
                            {this.props.contractorDetails.website ? <FaCheck className="item-icon green" /> : <FaTimes className="item-icon red" />}
                            Website Link
                        </span>
                        <span className="item-with-icon" style={{ paddingBottom: "5px" }}>
                            {this.props.contractorDetails.specials ? <FaCheck className="item-icon green" /> : <FaTimes className="item-icon red" />}
                            Specials
                        </span>
                    </>
                )}
                <div style={{ justifyContent: "space-around", marginTop: "10px", marginBottom: "0px" }} className="button-container">
                    <Button
                        style={{ marginRight: "0", backgroundColor: "#282828", color: "white", fontWeight: "bold" }}
                        onClick={() => window.location.href = "/settings"}
                        variant="contained"
                    >
                        FILL OUT DETAILS
                    </Button>
                </div>
            </>
        );
    }
}