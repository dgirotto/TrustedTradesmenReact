import React, { Component } from "react";
import "./PageNotFound.css";
import Title from "../../components/UI/Title/Title";

class PageNotFound extends Component {
  render() {
    return (
      <div className="page-not-found-container">
        <Title>404 &#8210; PAGE NOT FOUND</Title>
        <p className="page-not-found-msg">This link is either broken or the page does not exist.</p>
      </div>);
  }
}

export default PageNotFound;
