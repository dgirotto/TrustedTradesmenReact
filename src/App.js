import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Toolbar from "./components/UI/Toolbar/Toolbar";
import SideDrawer from "./components/UI/SideDrawer/SideDrawer";
import Backdrop from "./components/UI/Backdrop/Backdrop";

import HomePage from "./pages/HomePage/HomePage";
import ServicesPage from "./pages/ServicesPage/ServicesPage";
import ServiceDetailsPage from "./pages/ServiceDetailsPage/ServiceDetailsPage";
import JobsPage from "./pages/JobsPage/JobsPage";
import AccountPage from "./pages/AccountPage/AccountPage";
import LoginPage from "./pages/LoginPage/LoginPage";

import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

class App extends Component {
  state = {
    sideDrawerOpen: false
  };

  drawerToggleClickHandler = () => {
    this.setState(prevState => {
      return { sideDrawerOpen: !prevState.sideDrawerOpen };
    });
  };

  backdropClickHandler = () => {
    this.setState(prevState => {
      return { sideDrawerOpen: false };
    });
  };

  render() {
    return (
      <BrowserRouter>
        <div className="app-container">
          <Toolbar
            drawerToggleClickHandler={this.drawerToggleClickHandler}
          ></Toolbar>
          <SideDrawer show={this.state.sideDrawerOpen} />

          {this.state.sideDrawerOpen ? (
            <Backdrop click={this.backdropClickHandler} />
          ) : null}

          <main className="main">
            <Switch>
              <Route path="/" exact component={HomePage} />
              <Route path="/services" exact component={ServicesPage} />
              <Route path="/services/:id" component={ServiceDetailsPage} />
              <Route path="/login" component={LoginPage} />
              <ProtectedRoute>
                <Route path="/account" component={AccountPage} />
                <Route path="/jobs" component={JobsPage} />
              </ProtectedRoute>
            </Switch>
          </main>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
