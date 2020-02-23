import React, { Component } from "react";
import axios from "axios";
import "./LoginPage.css";

import Title from "../../components/UI/Title/Title";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      isLoading: false,
      error: null
    };
  }

  // login = () => {
  //   axios
  //     .post("http://dgirotto.a2hosted.com/api/user/login.php", {
  //       email: this.state.email,
  //       password: this.state.password
  //     })
  //     .then(res => {
  //       this.setState({ error: null });
  //       console.log(res.data.jwt);
  //       localStorage.setItem(
  //         "login",
  //         JSON.stringify({
  //           token: res.data.jwt
  //         })
  //       );
  //       this.setFromLocalStorage();
  //       this.getAccountDetails();
  //     })
  //     .catch(() => {
  //       this.setState({ error: "Invalid username or password!" });
  //     });
  // };

  login = () => {
    axios
      .post(
        "https://cors-anywhere.herokuapp.com/http://dgirotto.a2hosted.com/api/user/login.php",
        {
          email: this.state.email,
          password: this.state.password
        }
      )
      .then(res => {
        localStorage.setItem("jwt-token", res.data.jwt);
        this.props.history.push("/account");
      })
      .catch(error => {
        this.setState({ error: error.message });
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
