import React, { Component } from "react";
import axios from "axios";
import "./LoginPage.css";

import Title from "../../components/UI/Title/Title";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import { AuthService } from "../../services/auth";
import { CacheService } from "../../services/caching";

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      isAuth: false,
      isLoading: false,
      error: null
    };
  }

  componentDidMount() {
    if (this.props.isAuth) {
      window.location.href = "/account";
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.isAuth !== prevProps.isAuth) {
      this.setState({ isAuth: this.props.isAuth }, () => {
        if (this.state.isAuth) {
          window.location.href = "/";
        }
      });
    }
  }

  login = () => {
    if (!this.state.email || !this.state.password) {
      return;
    }
    this.setState({ isLoading: true });

    const auth = {
      email: this.state.email,
      password: this.state.password
    };

    AuthService.login(auth)
      .then(res => {
        const token = res.data.jwt;

        console.log("JWT: " + JSON.stringify(res));
        alert("GOT JWT: " + res.data.jwt);

        localStorage.setItem("jwt-token", token);
        CacheService.cacheToken(token);
        this.setState({ isLoading: false });
        window.location.href = "/account";
      })
      .catch(error => {
        this.setState({ error: error.message, isLoading: false });
      });
  };

  register = () => {
    alert("Hello");
  };

  change = event => {
    this.setState({ [event.target.name]: event.target.value });
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
            value={this.state.email}
            variant="outlined"
            onChange={this.change}
          ></TextField>
          <TextField
            type="password"
            name="password"
            label="password"
            value={this.state.password}
            variant="outlined"
            onChange={this.change}
          ></TextField>
          {this.state.error ? (
            <span className="Error">{this.state.error}</span>
          ) : null}
          <Button onClick={this.login} variant="contained" color="primary">
            Login
          </Button>
          <Button onClick={this.register} variant="contained" color="secondary">
            Create Account
          </Button>
        </form>
      </div>
    );
  }
}
export default LoginPage;
