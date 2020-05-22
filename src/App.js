import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Toolbar from "./components/UI/Toolbar/Toolbar";
import SideDrawer from "./components/UI/SideDrawer/SideDrawer";
import Backdrop from "./components/UI/Backdrop/Backdrop";
import PageNotFound from "./pages/PageNotFound/PageNotFound";
import HomePage from "./pages/HomePage/HomePage";
import ServicesPage from "./pages/ServicesPage/ServicesPage";
import ServiceDetailsPage from "./pages/ServiceDetailsPage/ServiceDetailsPage";
import ContractorsPage from "./pages/ContractorsPage/ContractorsPage";
import ContractorDetailsPage from "./pages/ContractorDetailsPage/ContractorDetailsPage";
import LeadsPage from "./pages/LeadsPage/LeadsPage";
import JobsPage from "./pages/JobsPage/JobsPage";
import SettingsPage from "./pages/SettingsPage/SettingsPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import { PrivateRoute } from "./components/PrivatedRoute";
import { AuthService } from "./services/auth";

import "./App.css";

class App extends Component {
  state = {
    isAuth: false,
    userType: null,
    sideDrawerOpen: false
  };

  authenticate() {
    if (AuthService.isAuthenticated()) {
      this.setState({
        isAuth: true,
        userType: AuthService.getRole()
      });
    } else {
      this.setState({ isAuth: false, userType: null });
    }
  }

  componentDidMount() {
    this.authenticate();
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
          {/* TODO: Move this to its own component */}
          <Toolbar
            isAuth={this.state.isAuth}
            userType={this.state.userType}
            logout={this.handleLogout}
            drawerToggleClickHandler={this.drawerToggleClickHandler}
          />
          <SideDrawer
            isAuth={this.state.isAuth}
            userType={this.state.userType}
            logout={this.handleLogout}
            drawerToggleClickHandler={this.drawerToggleClickHandler}
            show={this.state.sideDrawerOpen}
          />
          {this.state.sideDrawerOpen ? (
            <Backdrop click={this.backdropClickHandler} />
          ) : null}

          {/* <main className="main"> */}
          <Switch>
            <Route path="/" exact component={HomePage} />
            <Route path="/services" exact component={ServicesPage} />
            <PrivateRoute path="/services/:id" component={ServiceDetailsPage} />
            <Route path="/register" render={() => <RegisterPage />} />
            <Route
              path="/login"
              render={() => (
                <LoginPage
                  isAuth={this.state.isAuth}
                  authenticate={this.authenticate}
                />
              )}
            />
            {/* <PrivateRoute path="/contractors" component={ContractorsPage} /> */}
            <PrivateRoute
              path="/contractors/:id"
              component={ContractorDetailsPage}
            />
            <PrivateRoute
              path="/leads"
              component={LeadsPage}
              notAllowed={[0, 2]}
            />
            <PrivateRoute path="/jobs" component={JobsPage} />
            <PrivateRoute
              path="/settings"
              component={SettingsPage}
              userType={this.state.userType}
            />
            <PrivateRoute path="/logout" component={LoginPage} />
            <Route component={PageNotFound} />
          </Switch>
          {/* </main> */}
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
