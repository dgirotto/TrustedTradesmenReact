import React, { Component } from "react";
import "./ResetPage.css";
import Backdrop from "../../components/UI/Backdrop/Backdrop";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

import { AuthService } from "../../services/auth";

function AlertPopup(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class ResetPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            resetDetails: {
                resetToken: "",
                password: "",
                confirmPassword: ""
            },
            isLoading: false,
            showSnackbar: false,
            isError: false,
            message: ""
        };
    }

    componentDidMount() {
        const urlTokens = window.location.search.split('=');
        console.log(urlTokens.length);

        if (urlTokens.length === 2 && urlTokens[0] === '?token') {
            this.setState({ resetDetails: { resetToken: urlTokens[1] } });
        }
        else {
            window.location.href = '/login';
        }
    }

    reset = () => {
        if (this.state.resetDetails.password !== this.state.resetDetails.confirmPassword) {
            this.setState({
                showSnackbar: true,
                isError: true,
                message: "Passwords do not match."
            });
            return;
        }

        this.setState({ isLoading: true });

        AuthService.resetPassword({
            resetToken: this.state.resetDetails.resetToken,
            password: this.state.resetDetails.password
        })
            .then(res => {
                this.setState({
                    resetDetails: {
                        resetToken: "",
                        password: "",
                        confirmPassword: ""
                    },
                    isLoading: false,
                    showSnackbar: true,
                    isError: false,
                    message: res.data.message
                });
            })
            .catch(error => {
                this.setState({
                    isLoading: false,
                    showSnackbar: true,
                    isError: true,
                    message: error.response.data.message
                });
            });
    };

    change = event => {
        const newResetDetails = Object.assign(this.state.resetDetails, {
            [event.target.name]: event.target.value
        });
        this.setState({
            resetDetails: newResetDetails
        });
    };

    toggleSnackbar = () => {
        this.setState({ showSnackbar: !this.state.showSnackbar });
    };

    render() {
        return (
            <div className="reset-page-container">
                <div className="login-form">
                    <h1 className="login-form-title">CHANGE PASSWORD</h1>
                    <div className="textfield-container-col">
                        <TextField
                            type="password"
                            name="password"
                            label="Password"
                            value={this.state.resetDetails.password || ""}
                            variant="outlined"
                            onChange={this.change}
                        />
                    </div>
                    <div className="textfield-container-col">
                        <TextField
                            type="password"
                            name="confirmPassword"
                            label="Confirm Password"
                            value={this.state.resetDetails.confirmPassword || ""}
                            variant="outlined"
                            onChange={this.change}
                        />
                    </div>
                    <Button
                        disabled={
                            !this.state.resetDetails.password ||
                            !this.state.resetDetails.confirmPassword
                        }
                        onClick={this.reset}
                        variant="contained"
                        color="primary"
                        style={{ width: "190px", fontWeight: "bold" }}
                    >
                        UPDATE PASSWORD
                    </Button>
                </div>

                {this.state.isLoading && <Backdrop />}

                <Snackbar
                    open={this.state.showSnackbar}
                    autoHideDuration={5000}
                    onClose={this.toggleSnackbar}
                >
                    <AlertPopup onClose={this.toggleSnackbar} severity={this.state.isError ? "error" : "success"}>
                        {this.state.message}
                    </AlertPopup>
                </Snackbar>
            </div>
        );
    }
}
export default ResetPage;
