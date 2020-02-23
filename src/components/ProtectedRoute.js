import React, { Component } from "react";
import axios from "axios";
import Aux from "../helpers/Aux";
import { getJwt } from "../helpers/Jwt";

class ProtectedRoute extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: undefined
    };
  }

  componentDidMount() {
    this.setState({ user: undefined });
    alert("Inside ProtectedRoute componentDidMount");
    const jwt = getJwt();
    console.log(`JWT TOKEN => ${jwt}`);

    if (!jwt) {
      window.location.href = "/login";
    }
    axios
      .get(
        "https://cors-anywhere.herokuapp.com/http://dgirotto.a2hosted.com/api/user/read_one.php",
        { headers: { Authorization: `Bearer ${jwt}` } }
      )
      .then(res => {
        console.log(`RESULT: ${JSON.stringify(res)}`);
        this.setState({ user: res.data });
      })
      .catch(error => {
        console.log(error);
        // Remove JWT and redirect back to login page
        localStorage.removeItem("jwt-token");
        window.location.href = "/login";
      });
  }

  render() {
    if (this.state.user === undefined) {
      return <Aux>Loading...</Aux>;
    }
    return <Aux>{this.props.children}</Aux>;
  }
}

export default ProtectedRoute;
