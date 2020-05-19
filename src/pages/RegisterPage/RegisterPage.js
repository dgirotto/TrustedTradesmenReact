import React, { Component } from "react";
import "./RegisterPage.css";

import Title from "../../components/UI/Title/Title";
import Loader from "../../components/UI/Loader/Loader";
import Backdrop from "../../components/UI/Backdrop/Backdrop";
import Aux from "../../helpers/Aux";

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

  componentDidMount() {}

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
        this.setState({ isLoading: false });
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
      <div className="login-form">
        {this.state.isLoading ? (
          <Aux>
            <Loader size={60} />
            <Backdrop />
          </Aux>
        ) : (
          <form>
            <Title size="Medium" color="Black">
              REGISTER
            </Title>
            <TextField
              type="text"
              name="email"
              label="email"
              variant="outlined"
              onChange={this.change}
            />
            <TextField
              type="password"
              name="password"
              label="password"
              variant="outlined"
              onChange={this.change}
            />
            <TextField
              type="password"
              name="confirmPassword"
              label="confirm password"
              variant="outlined"
              onChange={this.change}
            />
            {this.state.error ? (
              <span className="Error">{this.state.error}</span>
            ) : null}
            <Button
              disabled={
                !this.state.registerDetails.email ||
                !this.state.registerDetails.password ||
                !this.state.registerDetails.confirmPassword
              }
              onClick={this.register}
              variant="contained"
              color="primary"
            >
              CREATE ACCOUNT
            </Button>
            <Button
              onClick={() => (window.location.href = "/login")}
              variant="contained"
              color="secondary"
            >
              LOGIN PAGE
            </Button>
            {this.isLoading && <Loader size={30} />}
          </form>
        )}
      </div>
    );
  }
}
export default RegisterPage;
