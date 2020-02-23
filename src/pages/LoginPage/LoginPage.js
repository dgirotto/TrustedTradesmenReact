import React, { Component } from "react";
import "./LoginPage.css";

import Title from "../../components/UI/Title/Title";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

class LoginPage extends Component {
  state = {
    isAuth: false,
    isLoading: false,
    email: null,
    password: null
  };
}

export default LoginPage;
