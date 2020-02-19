import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Toolbar from "./components/Toolbar/Toolbar";
import SideDrawer from "./components/SideDrawer/SideDrawer";
import Backdrop from "./components/Backdrop/Backdrop";
import HomePage from "./pages/HomePage/HomePage";
import ServicesPage from "./pages/ServicesPage/ServicesPage";
import ServiceDetailsPage from "./pages/ServiceDetailsPage/ServiceDetailsPage";
import AccountPage from "./pages/AccountPage/AccountPage";
import Login from "./components/Login/Login";

import "./App.css";

class App extends Component {
  // In modern React, we can set the state this way (instead of having to use
  // a constructor and calling super())
  state = {
    sideDrawerOpen: false
  };

  // New function declaration: "myFunc = () => {}" ensures the "this" keyword
  // refers to the component's state instead of the click event object
  drawerToggleClickHandler = () => {
    // React updates its state in "batches" now, updating of the state is done async
    // Therefore, we must use function notation within setState() and pass previous state in
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
    let backdrop;
    if (this.state.sideDrawerOpen) {
      backdrop = <Backdrop click={this.backdropClickHandler} />;
    }

    return (
      <Router>
        <div className="app-container">
          <Toolbar
            drawerToggleClickHandler={this.drawerToggleClickHandler}
          ></Toolbar>
          <SideDrawer show={this.state.sideDrawerOpen} />
          {backdrop}

          <main className="main">
            <Switch>
              <Route path="/" exact component={HomePage} />
              <Route path="/services" exact component={ServicesPage} />
              <Route path="/services/:id" component={ServiceDetailsPage} />
              <Route path="/account" component={AccountPage} />
              {/* <Login /> */}
            </Switch>
          </main>
        </div>
      </Router>
    );
  }
}

export default App;
