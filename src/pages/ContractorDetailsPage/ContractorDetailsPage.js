import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import Auxil from "../../helpers/Auxil";
import Backdrop from "../../components/UI/Backdrop/Backdrop";
import Title from "../../components/UI/Title/Title";
import "./ContractorDetailsPage.css";

import { AccountService } from "../../services/account";
import { AuthService } from "../../services/auth";

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
            <Auxil>
                <Title>{this.state.contractorDetails.firstName.toUpperCase()} {this.state.contractorDetails.lastName.toUpperCase()}</Title>
                <h2 className="form-title">SERVICES OFFERED</h2>
                <p>{this.state.contractorDetails.description}</p>
            </Auxil>
        );
    }

    render() {
        return (
            <div className="service-details-page-container">
                {this.state.contractorDetails && this.renderContent()}
                {this.state.isLoading ? <Backdrop /> : null}
            </div>
        );
    }
}

export default ContractorDetailsPage;



