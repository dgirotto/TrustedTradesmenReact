import React, { Component } from "react";

class ProtectedRoute extends Component {
  state = {
    user: undefined
  };

  render() {
    return <div>Hello World</div>;
  }
}

export default ProtectedRoute;
