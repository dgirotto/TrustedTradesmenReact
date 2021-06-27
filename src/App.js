import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import uuid from "react-uuid";

import Toolbar from "./components/UI/Toolbar/Toolbar";
import SideDrawer from "./components/UI/SideDrawer/SideDrawer";
import Backdrop from "./components/UI/Backdrop/Backdrop";
import LoginDialog from "./components/LoginDialog";

import HomePage from "./pages/HomePage/HomePage";
import ServicesPage from "./pages/ServicesPage/ServicesPage";
import ServiceDetailsPage from "./pages/ServiceDetailsPage/ServiceDetailsPage";
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
    sideDrawerOpen: false,
    loginModalOpen: false,
    isRegistering: false
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
      this.setState({
        isAuth: false,
        userType: null
      });
    }
  }

  handleLogout = () => {
    this.setState({
      isAuth: false,
      userType: null
    });
    AuthService.logout();
  };

  handleLoginOpen = (isRegistering) => {
    this.setState({
      loginModalOpen: true,
      isRegistering: isRegistering
    });
  }

  handleLoginClose = () => {
    this.setState({
      loginModalOpen: false
    });
  }

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
            handleOpen={this.handleLoginOpen}
          />

          <SideDrawer
            isAuth={this.state.isAuth}
            userType={this.state.userType}
            userId={this.state.userId}
            logout={this.handleLogout}
            drawerToggleClickHandler={this.drawerToggleClickHandler}
            show={this.state.sideDrawerOpen}
            handleOpen={this.handleLoginOpen}
          />

          <LoginDialog
            isOpen={this.state.loginModalOpen}
            isRegistering={this.state.isRegistering}
            handleClose={this.handleLoginClose}
          />

          {this.state.sideDrawerOpen ? (
            <Backdrop hideLoader={true} click={this.backdropClickHandler} />
          ) : null}

          <Switch>
            <Route
              path="/"
              exact
              render={() => (
                <HomePage
                  isAuth={this.state.isAuth}
                  handleOpen={this.handleLoginOpen}
                />
              )}
            />
            <Route
              path="/services"
              exact
              render={() => (
                <ServicesPage
                  isAuth={this.state.isAuth}
                  userType={this.state.userType}
                  handleOpen={this.handleLoginOpen}
                />
              )}
            />
            <PrivateRoute
              path="/services/:id"
              component={ServiceDetailsPage}
            />
            <PrivateRoute
              path="/logout"
              render={() => (
                <HomePage
                  isAuth={this.state.isAuth}
                  handleOpen={this.handleLoginOpen}
                />
              )}
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
              path="/disclaimers"
              render={() => (
                <DisclaimersPage
                  isAuth={this.state.isAuth}
                  userType={this.state.userType}
                />
              )}
            />
            <Route
              path="/faq"
              component={FaqPage}
            />
            <Route
              path="/support"
              component={SupportPage}
            />
            <Route
              component={PageNotFound}
            />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
