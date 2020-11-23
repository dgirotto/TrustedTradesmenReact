import React, { Component } from "react";
import "./LoginPage.css";
import Backdrop from "../../components/UI/Backdrop/Backdrop";
import Auxil from "../../helpers/Auxil";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
// import Checkbox from "@material-ui/core/Checkbox";
// import FormControlLabel from "@material-ui/core/FormControlLabel";

import { AuthService } from "../../services/auth";
import { CacheService } from "../../services/caching";

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginDetails: {
        email: "",
        password: ""
      },
      emailToReset: "",
      showResetForm: false,
      remember: false,
      isLoading: false,
      error: null
    };
  }

  componentDidMount() {
    if (this.props.isAuth) {
      window.location.href = "/services";
    }
  }

  login = () => {
    this.setState({ isLoading: true });
    
    AuthService.login(this.state.loginDetails)
      .then(res => {
        const token = res.data.jwt;
        localStorage.setItem("jwt-token", token);
        CacheService.cacheToken(token);
        window.location.href = "/jobs";
      })
      .catch(error => {
        this.setState({ error: error.message, isLoading: false });
      });
  };

  resetPassword = () => {
    this.setState({ isLoading: true });

    AuthService.resetPassword({ email: this.state.emailToReset })
      .then(res => {
        // TODO: Emit message "Check your email for your new password"
        this.setState({ isLoading: false });
      })
      .catch(error => {
        this.setState({ error: error.message, isLoading: false });
      });
  };

  handleCheckboxChange = () => {
    this.setState({
      remember: !this.state.remember
    });
  };

  toggleResetPassword = () => {
    this.setState({ showResetForm: !this.state.showResetForm });
  };

  change = event => {
    const newLoginDetails = Object.assign(this.state.loginDetails, {
      [event.target.name]: event.target.value
    });
    
    this.setState({
      loginDetails: newLoginDetails
    });
  };

  emailChange = event => {
    this.setState({
      emailToReset: event.target.value
    });
  };

  render() {
    return (
      <div className="login-page-container">
        <div className="login-form">
          {!this.state.showResetForm ? (
            <Auxil>
              <h1 className="login-form-title">LOGIN</h1>
                <div className="textfield-container-row">
                  <TextField
                    type="text"
                    name="email"
                    label="email"
                    value={this.state.loginDetails.email || ""}
                    variant="outlined"
                    onChange={this.change}
                  />
                </div>
                <div className="textfield-container-row">
                  <TextField
                    type="password"
                    name="password"
                    label="password"
                    value={this.state.loginDetails.password || ""}
                    variant="outlined"
                    onChange={this.change}
                  />
                </div>
                {/* <FormControlLabel
                  control={
                    <Checkbox
                      onChange={this.handleCheckboxChange}
                      checked={this.state.remember}
                    />
                  }
                  label="Remember me"
                /> */}
                <div className="forgot-password" onClick={this.toggleResetPassword}>
                  Forgot Password?
                </div>
                <Button
                  disabled={
                    !this.state.loginDetails.email ||
                    !this.state.loginDetails.password
                  }
                  onClick={this.login}
                  variant="contained"
                  color="primary"
                  style={{ width: "175px" }}
                >
                  LOGIN
                </Button>
                <div className="no-account-msg">
                  Don't have an account? Create one <a href="/register">here</a>.
                </div>
            </Auxil>
          ) : (
            <Auxil>
                <h1 className="login-form-title">FORGOT PASSWORD</h1>
                <span className="reset-password-msg">
                  Enter the email address associated with your account and we'll
                  email you a link to reset your password.
                </span>
                <TextField
                  type="text"
                  name="email"
                  label="email"
                  value={this.state.emailToReset || ""}
                  variant="outlined"
                  onChange={this.emailChange}
                />
                <div className="reset-button-container">
                  <Button
                    disabled={!this.state.emailToReset}
                    onClick={this.resetPassword}
                    variant="contained"
                    color="primary"
                    style={{ width: "175px", marginTop: "15px" }}
                  >
                    RESET PASSWORD
                  </Button>
                  <Button
                    onClick={this.toggleResetPassword}
                    variant="contained"
                    color="secondary"
                    style={{ width: "175px", marginTop: "15px" }}
                  >
                    BACK
                  </Button>
                </div>
              </Auxil>
            )}
          {this.state.isLoading && <Backdrop />}
        </div>
      </div>
    );
  }
}
export default LoginPage;
