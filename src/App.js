import React, { Component } from "react";
import Toolbar from "./components/Toolbar/Toolbar";
import SideDrawer from "./components/SideDrawer/SideDrawer";
import Backdrop from "./components/Backdrop/Backdrop";
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
      <div className="app-container">
        {/* Pass a reference to the drawerClickHandler function to the toolbar component */}
        <Toolbar
          drawerToggleClickHandler={this.drawerToggleClickHandler}
        ></Toolbar>
        <SideDrawer show={this.state.sideDrawerOpen} />
        {backdrop}
        <main className="main">
          <p>Page content</p>
        </main>
      </div>
    );
  }
}

export default App;
