import React, { Component } from "react";
import "./RegisterPage.css";
import Backdrop from "../../components/UI/Backdrop/Backdrop";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

import { AuthService } from "../../services/auth";

function AlertPopup(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

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
      showSnackbar: false,
      isError: false,
      message: ""
    };
  }

  componentDidMount() {
    if (this.props.isAuth) {
      window.location.href = "/services";
    }
  }

  register = () => {
    if (this.state.registerDetails.password !== this.state.registerDetails.confirmPassword) {
      this.setState({
        showSnackbar: true,
        isError: true,
        message: "Passwords do not match."
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
        this.setState({
          registerDetails: {
            email: "",
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
    const newRegisterDetails = Object.assign(this.state.registerDetails, {
      [event.target.name]: event.target.value
    });
    this.setState({
      registerDetails: newRegisterDetails
    });
  };

  toggleSnackbar = () => {
    this.setState({ showSnackbar: !this.state.showSnackbar });
  };

  render() {
    return (
      <div className="register-page-container">
        <div className="login-form">
          <h1 className="login-form-title">REGISTER</h1>
          <div className="textfield-container-col">
            <TextField
              type="text"
              name="email"
              label="email"
              value={this.state.registerDetails.email || ""}
              variant="outlined"
              onChange={this.change}
            />
          </div>
          <div className="textfield-container-col">
            <TextField
              type="password"
              name="password"
              label="password"
              value={this.state.registerDetails.password || ""}
              variant="outlined"
              onChange={this.change}
            />
          </div>
          <div className="textfield-container-col">
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
export default RegisterPage;
