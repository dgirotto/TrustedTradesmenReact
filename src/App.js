import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Toolbar from "./components/UI/Toolbar/Toolbar";
import SideDrawer from "./components/UI/SideDrawer/SideDrawer";
import Backdrop from "./components/UI/Backdrop/Backdrop";

import HomePage from "./pages/HomePage/HomePage";
import ServicesPage from "./pages/ServicesPage/ServicesPage";
import ServiceDetailsPage from "./pages/ServiceDetailsPage/ServiceDetailsPage";
import ContractorsPage from "./pages/ContractorsPage/ContractorsPage";
import ContractorDetailsPage from "./pages/ContractorDetailsPage/ContractorDetailsPage";
import LeadsPage from "./pages/LeadsPage/LeadsPage";
import JobsPage from "./pages/JobsPage/JobsPage";
import AccountPage from "./pages/AccountPage/AccountPage";
import LoginPage from "./pages/LoginPage/LoginPage";

import { PrivateRoute } from "./components/PrivatedRoute";
import { AuthService } from "./services/auth";

import "./App.css";

class App extends Component {
  state = {
    isAuth: false,
    sideDrawerOpen: false
  };

  authenticate() {
    if (AuthService.isAuthenticated()) {
      // TODO: Get UserType from auth service and pass to PrivateRoute, ToolBar, and SideDrawer
      this.setState({
        isAuth: true
      });
    } else {
      this.setState({ isAuth: false });
    }
  }

  componentDidMount() {
    this.authenticate();
  }

  handleLogout = () => {
    this.setState({
      isAuth: false
    });
    AuthService.logout();
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
          {/* TODO: Move this to its own component */}
          <Toolbar
            isAuth={this.state.isAuth}
            logout={this.handleLogout}
            drawerToggleClickHandler={this.drawerToggleClickHandler}
          />
          <SideDrawer
            isAuth={this.state.isAuth}
            logout={this.handleLogout}
            show={this.state.sideDrawerOpen}
            drawerToggleClickHandler={this.drawerToggleClickHandler}
          />
          {this.state.sideDrawerOpen ? (
            <Backdrop click={this.backdropClickHandler} />
          ) : null}

          <main className="main">
            <Switch>
              <Route path="/" exact component={HomePage} />
              <Route
                path="/services"
                exact
                component={ServicesPage}
                // isAuth={this.state.isAuth}
              />
              <PrivateRoute
                path="/services/:id"
                component={ServiceDetailsPage}
                allowed={[0, 1, 2, 3]}
              />
              <Route
                path="/login"
                render={() => (
                  <LoginPage
                    isAuth={this.state.isAuth}
                    authenticate={this.authenticate}
                  />
                )}
              />
              <PrivateRoute
                path="/contractors"
                component={ContractorsPage}
                allowed={[0, 1, 2, 3]}
              />
              <PrivateRoute
                path="/contractors/:id"
                component={ContractorDetailsPage}
                allowed={[0, 1, 2, 3]}
              />
              {/* Contractors and Admins can access leads page */}
              <PrivateRoute
                path="/leads"
                component={LeadsPage}
                allowed={[1, 3]}
              />
              {/*  Contractors, Inspectors and Admins can access jobs page */}
              <PrivateRoute
                path="/jobs"
                component={JobsPage}
                allowed={[1, 2, 3]}
              />
              <PrivateRoute
                path="/account"
                component={AccountPage}
                allowed={[0, 1, 2, 3]}
              />
              <PrivateRoute
                path="/logout"
                component={LoginPage}
                allowed={[0, 1, 2, 3]}
              />
            </Switch>
          </main>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
