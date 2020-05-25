import React, { Component } from "react";
import "./RegisterPage.css";
import Backdrop from "../../components/UI/Backdrop/Backdrop";
import Card from "@material-ui/core/Card";
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
      <Card variant="outlined" className="login-form">
        <form>
          <h2 className="form-title">REGISTER</h2>
          <TextField
            type="text"
            name="email"
            label="email"
            value={this.state.registerDetails.email || ""}
            variant="outlined"
            onChange={this.change}
          />
          <TextField
            type="password"
            name="password"
            label="password"
            value={this.state.registerDetails.password || ""}
            variant="outlined"
            onChange={this.change}
          />
          <TextField
            type="password"
            name="confirmPassword"
            label="confirm password"
            value={this.state.registerDetails.confirmPassword || ""}
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
          <p>
            Have an account? Login <a href="/login">here</a>
          </p>
        </form>
        {this.state.isLoading ? <Backdrop /> : null}
      </Card>
    );
  }
}
export default RegisterPage;
