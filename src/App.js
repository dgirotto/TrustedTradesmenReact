import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import uuid from "react-uuid";

import Toolbar from "./components/UI/Toolbar/Toolbar";
import SideDrawer from "./components/UI/SideDrawer/SideDrawer";
import Backdrop from "./components/UI/Backdrop/Backdrop";

import HomePage from "./pages/HomePage/HomePage";
import ServicesPage from "./pages/ServicesPage/ServicesPage";
import ServiceDetailsPage from "./pages/ServiceDetailsPage/ServiceDetailsPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import ResetPage from "./pages/ResetPage/ResetPage";
import ContractorDetailsPage from "./pages/ContractorDetailsPage/ContractorDetailsPage";
import LeadsPage from "./pages/LeadsPage/LeadsPage";
import JobsPage from "./pages/JobsPage/JobsPage";
import AccountPage from "./pages/AccountPage/AccountPage";
import AboutPage from "./pages/AboutPage/AboutPage";
import DisclaimersPage from "./pages/DisclaimersPage/DisclaimersPage";
import FaqPage from "./pages/FaqPage/FaqPage";
import SupportPage from "./pages/SupportPage/SupportPage";
import PageNotFound from "./pages/PageNotFound/PageNotFound";

import { PrivateRoute } from "./components/PrivatedRoute";
import { AuthService } from "./services/auth";

import "./App.css";

class App extends Component {
  state = {
    isAuth: false,
    userType: null,
    sideDrawerOpen: false
  };

  componentDidMount() {
    this.authenticate();
  }

  authenticate() {
    if (AuthService.isAuthenticated()) {
      this.setState({
        isAuth: true,
        userType: AuthService.getRole(),
        userId: AuthService.getUserId()
      });
    } else {
      this.setState({ isAuth: false, userType: null });
    }
  }

  handleLogout = () => {
    this.setState({
      isAuth: false,
      userType: null
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
      return { sideDrawerOpen: !prevState.sideDrawerOpen };
    });
  };

  // TODO: Implement this: https://stackoverflow.com/questions/59422159/redirecting-a-user-to-the-page-they-requested-after-successful-authentication-wi
  render() {
    return (
      <BrowserRouter>
        <div className="app-container">
          <Toolbar
            isAuth={this.state.isAuth}
            userType={this.state.userType}
            userId={this.state.userId}
            logout={this.handleLogout}
            drawerToggleClickHandler={this.drawerToggleClickHandler}
          />
          <SideDrawer
            isAuth={this.state.isAuth}
            userType={this.state.userType}
            userId={this.state.userId}
            logout={this.handleLogout}
            drawerToggleClickHandler={this.drawerToggleClickHandler}
            show={this.state.sideDrawerOpen}
          />
          {this.state.sideDrawerOpen ? (
            <Backdrop hideLoader={true} click={this.backdropClickHandler} />
          ) : null}

          <Switch>
            <Route
              path="/"
              exact
              component={HomePage}
            />
            <Route path="/services"
              exact
              render={() => <ServicesPage isAuth={this.state.isAuth} userType={this.state.userType} />}
            />
            <PrivateRoute
              path="/services/:id"
              component={ServiceDetailsPage}
            />
            <Route
              path="/register"
              render={() => <RegisterPage isAuth={this.state.isAuth} />}
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
              path="/logout"
              component={LoginPage}
            />
            <Route
              path="/reset"
              render={() => <ResetPage />}
            />
            <PrivateRoute
              path="/contractors/:id"
              component={ContractorDetailsPage}
            />
            <PrivateRoute
              path="/leads"
              component={LeadsPage}
              notAllowed={[0, 2]}
              key={() => uuid()}
            />
            <PrivateRoute
              path="/jobs"
              component={JobsPage}
              key={() => uuid()}
            />
            <PrivateRoute
              path="/account"
              component={AccountPage}
            />
            <Route
              path="/about"
              component={AboutPage}
            />
            <Route
              render={() => <DisclaimersPage isAuth={this.state.isAuth} userType={this.state.userType} />}
            />
            <Route
              path="/faq"
              component={FaqPage}
            />
            <Route
              path="/support"
              component={SupportPage}
            />
            <Route component={PageNotFound} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
