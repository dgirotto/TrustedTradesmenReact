import React, { Component } from "react";
import "./LoginPage.css";
import Backdrop from "../../components/UI/Backdrop/Backdrop";
import Card from "@material-ui/core/Card";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
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
        window.location.href = "/services";
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
        <Card variant="outlined" className="login-form">
          {!this.state.showResetForm ? (
            <form>
              <h2 className="form-title">LOGIN</h2>
              <TextField
                type="text"
                name="email"
                label="email"
                value={this.state.loginDetails.email || ""}
                variant="outlined"
                onChange={this.change}
              />
              <TextField
                type="password"
                name="password"
                label="password"
                value={this.state.loginDetails.password || ""}
                variant="outlined"
                onChange={this.change}
              />
              {/* <FormControlLabel
              control={
                <Checkbox
                  onChange={this.handleCheckboxChange}
                  checked={this.state.remember}
                />
              }
              label="Remember me"
            /> */}
              <a className="reset-password" onClick={this.toggleResetPassword}>
                Forgot Password?
              </a>
              <Button
                disabled={
                  !this.state.loginDetails.email ||
                  !this.state.loginDetails.password
                }
                onClick={this.login}
                variant="contained"
                color="primary"
              >
                LOGIN
              </Button>
              <p>
                Don't have an account? Create one <a href="/register">here</a>
              </p>
              {this.state.error ? (
                <span className="Error">{this.state.error}</span>
              ) : null}
            </form>
          ) : (
            <form>
              <h2 className="form-title">FORGOT PASSWORD</h2>
              <span className="reset-password-msg">
                Enter the email address associated with your account and we'll
                email you a new password.
              </span>
              <TextField
                type="text"
                name="email"
                label="email"
                value={this.state.emailToReset || ""}
                variant="outlined"
                onChange={this.emailChange}
              />
              <Button
                disabled={!this.state.emailToReset}
                onClick={this.resetPassword}
                variant="contained"
                color="primary"
              >
                RESET PASSWORD
              </Button>
              <Button
                onClick={this.toggleResetPassword}
                variant="contained"
                color="secondary"
              >
                BACK
              </Button>
            </form>
          )}
          {this.state.isLoading ? <Backdrop /> : null}
        </Card>
      </div>
    );
  }
}
export default LoginPage;
