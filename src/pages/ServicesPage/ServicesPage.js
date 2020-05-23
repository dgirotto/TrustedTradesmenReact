import React, { Component } from "react";
import ServiceList from "../../components/ServiceList/ServiceList";
import Backdrop from "../../components/UI/Backdrop/Backdrop";
import Aux from "../../helpers/Aux";
import Title from "../../components/UI/Title/Title";
import "./ServicesPage.css";

class ServicesPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true
    };
  }

  componentDidMount() {}

  isDoneLoading = () => {
    this.setState({ isLoading: false });
  };

  render() {
    return (
      <div className={"services-page-container"}>
        <Aux>
          <Title>SERVICES</Title>
          <p>
            <a href="/login">Login</a> and choose from our many services.
          </p>
          <br />
          <ServiceList isDoneLoading={this.isDoneLoading} />
        </Aux>
        {this.state.isLoading ? (
          <Aux>
            <Backdrop />
          </Aux>
        ) : null}
      </div>
    );
  }
}

export default ServicesPage;
