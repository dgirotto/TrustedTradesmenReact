import React, { Component } from "react";
import axios from "axios";
import "./LoginPage.css";

import Title from "../../components/UI/Title/Title";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

class LoginPage extends Component {
  state = {
    // isAuth: false,
    isLoading: false,
    email: null,
    password: null
  };

  login = () => {
    axios
      .post("http://dgirotto.a2hosted.com/api/user/login.php", {
        email: this.state.email,
        password: this.state.password
      })
      .then(res => {
        this.setState({ error: null });
        console.log(res.data.jwt);
        localStorage.setItem(
          "login",
          JSON.stringify({
            token: res.data.jwt
          })
        );
        this.setFromLocalStorage();
        this.getAccountDetails();
      })
      .catch(() => {
        this.setState({ error: "Invalid username or password!" });
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
            onChange={event => {
              this.setState({ email: event.target.value });
            }}
            label="email"
            type="text"
            variant="outlined"
          ></TextField>
          <TextField
            onChange={event => {
              this.setState({ password: event.target.value });
            }}
            label="password"
            type="password"
            variant="outlined"
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
