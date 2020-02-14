import React, { Component } from "react";
import ReactDOM from "react-dom";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";

import "./App.css";

import Login from "./components/Login/Login";

// https://www.youtube.com/watch?v=l6nmysZKHFU&t=40s

// interface State {
//   isAuth: boolean;
//   isDrawerOpen: boolean;
//   isMobile: boolean;
//   user: JwtUser | null;
// }

export default class App extends Component {
  // constructor() {
  //   this.state = {
  //     isAuth: false,
  //     isDrawerOpen: false,
  //     isMobile: false,
  //     user: null
  //   };
  // }

  render() {
    return (
      <div className="App">
        Main page!
        <Login></Login>
      </div>
    );
  }
}
