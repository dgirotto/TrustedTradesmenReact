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

import { PrivateRoute } from "./components/PrivatedRoute";
import { AuthService } from "./services/auth";

import "./App.css";

class App extends Component {
  state = {
    isAuth: false,
    user: null,
    sideDrawerOpen: false
  };

  componentDidMount() {
    this.authenticate();
  }

  authenticate() {
    if (AuthService.isAuthenticated) {
      this.setState({ isAuth: true, user: AuthService.getAuthenticatedUser() });
    } else {
      this.setState({ isAuth: false });
    }
  }

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
              <Route
                path="/login"
                render={() => (
                  <LoginPage
                    isAuth={this.state.auth}
                    authenticate={this.authenticate}
                  />
                )}
              />
              <PrivateRoute path="/account" component={AccountPage} />
              <PrivateRoute path="/jobs" component={JobsPage} />
            </Switch>
          </main>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
