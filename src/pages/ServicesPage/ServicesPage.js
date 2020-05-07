import React, { Component } from "react";
import { AuthService } from "../../services/auth";
import ServiceList from "../../components/ServiceList/ServiceList";
import Loader from "../../components/UI/Loader/Loader";
import Backdrop from "../../components/UI/Backdrop/Backdrop";
import Aux from "../../helpers/Aux";
import "./ServicesPage.css";

class ServicesPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true
    };
  }

  componentDidMount() {
    this.setState({ isAuth: this.props.isAuth });
  }

  isDoneLoading = () => {
    this.setState({ isLoading: false });
  };

  render() {
    return (
      <div className={"services-page-container"}>
        <Aux>
          <ServiceList
            isAuth={this.state.isAuth}
            isDoneLoading={this.isDoneLoading}
          />
        </Aux>
        {this.state.isLoading ? (
          <Aux>
            <Loader size={60} />
            <Backdrop />
          </Aux>
        ) : null}
      </div>
    );
  }
}

export default ServicesPage;
