import React, { Component } from "react";
import "./LoginPage.css";

import Title from "../../components/UI/Title/Title";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Loader from "../../components/UI/Loader/Loader";
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
      isLoading: false,
      error: null
    };
  }

  componentDidMount() {
    if (this.props.isAuth) {
      window.location.href = "/settings";
    }
  }

  // componentDidUpdate(prevProps) {
  //   if (this.props.isAuth !== prevProps.isAuth) {
  //     this.setState({ isAuth: this.props.isAuth }, () => {
  //       if (this.state.isAuth) {
  //         window.location.href = "/";
  //       }
  //     });
  //   }
  // }

  login = () => {
    if (!this.state.loginDetails.email || !this.state.loginDetails.password) {
      return;
    }
    this.setState({ isLoading: true });

    AuthService.login(this.state.loginDetails)
      .then(res => {
        const token = res.data.jwt;
        localStorage.setItem("jwt-token", token);
        CacheService.cacheToken(token);
        this.setState({ isLoading: false });
        window.location.href = "/";
      })
      .catch(error => {
        this.setState({ error: error.message, isLoading: false });
      });
  };

  register = () => {
    alert("Register Clicked");
  };

  change = event => {
    const newLoginDetails = Object.assign(this.state.loginDetails, {
      [event.target.name]: event.target.value
    });
    this.setState({
      loginDetails: newLoginDetails
    });
  };

  render() {
    return (
      <div className="App">
        <form>
          <Title size="Medium" color="Black">
            Login
          </Title>
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
          {this.state.error ? (
            <span className="Error">{this.state.error}</span>
          ) : null}
          <Button onClick={this.login} variant="contained" color="primary">
            Login
          </Button>

          {this.isLoading && <Loader size={30} />}

          {/* <Button onClick={this.register} variant="contained" color="secondary">
            Create Account
          </Button> */}
        </form>
      </div>
    );
  }
}
export default LoginPage;
