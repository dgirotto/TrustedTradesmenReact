import React, { Component } from "react";
import "./PageNotFound.css";
import Title from "../../components/UI/Title/Title";
import Auxil from "../../helpers/Auxil";

class PageNotFound extends Component {
  render() {
    return <Auxil><br /><br /><br /><br /><Title>404 - PAGE NOT FOUND!</Title></Auxil>;
  }
}

export default PageNotFound;
