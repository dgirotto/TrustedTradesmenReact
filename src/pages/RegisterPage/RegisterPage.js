import React, { Component } from "react";
import "./RegisterPage.css";
import Backdrop from "../../components/UI/Backdrop/Backdrop";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import { AuthService } from "../../services/auth";

class RegisterPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      registerDetails: {
        email: "",
        password: "",
        confirmPassword: ""
      },
      isLoading: false,
      error: null
    };
  }

  componentDidMount() {
    if (this.props.isAuth) {
      window.location.href = "/services";
    }
  }

  register = () => {
    if (
      this.state.registerDetails.password !==
      this.state.registerDetails.confirmPassword
    ) {
      this.setState({
        error: "Passwords do not match!"
      });
      return;
    }
    this.setState({ isLoading: true });
    AuthService.register({
      email: this.state.registerDetails.email,
      password: this.state.registerDetails.password,
      accountType: 0
    })
      .then(res => {
        // TODO: Emit message "Account Created"
        this.setState({
          registerDetails: {
            email: "",
            password: "",
            confirmPassword: ""
          },
          isLoading: false
        });
      })
      .catch(error => {
        this.setState({ error: error.message, isLoading: false });
      });
  };

  change = event => {
    const newRegisterDetails = Object.assign(this.state.registerDetails, {
      [event.target.name]: event.target.value
    });
    this.setState({
      registerDetails: newRegisterDetails
    });
  };

  render() {
    return (
      <div className="register-page-container">
        <div className="login-form">
          <h1 className="login-form-title">REGISTER</h1>
          <div className="textfield-container-row">
            <TextField
              type="text"
              name="email"
              label="email"
              value={this.state.registerDetails.email || ""}
              variant="outlined"
              onChange={this.change}
            />
          </div>
          <div className="textfield-container-row">
            <TextField
              type="password"
              name="password"
              label="password"
              value={this.state.registerDetails.password || ""}
              variant="outlined"
              onChange={this.change}
            />
          </div>
          <div className="textfield-container-row">
            <TextField
              type="password"
              name="confirmPassword"
              label="confirm password"
              value={this.state.registerDetails.confirmPassword || ""}
              variant="outlined"
              onChange={this.change}
            />
          </div>
          <Button
            disabled={
              !this.state.registerDetails.email ||
              !this.state.registerDetails.password ||
              !this.state.registerDetails.confirmPassword
            }
            onClick={this.register}
            variant="contained"
            color="primary"
            style={{ width: "175px" }}
          >
            CREATE ACCOUNT
          </Button>
          <div className="have-account-msg">
            Already have an account? Login <a href="/login">here</a>.
          </div>
          {this.state.isLoading && <Backdrop />}
        </div>
      </div>
    );
  }
}
export default RegisterPage;
