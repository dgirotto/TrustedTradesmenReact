import React, { Component } from "react";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import "./Login.css";
// import Loader from "../../components/loader/loader";

class Login extends Component {
  // formTypes: 0 (login), 1 (register), 2 (reset password)
  constructor(props) {
    super(props);
    this.state = {
      formType: 0
    };
  }

  forgotPasswordHandler() {
    this.setState({ formType: 0 });
  }

  render() {
    let form = null;
    switch (this.state.formType) {
      case 0:
        form = (
          <div className="login-form">
            <form>
              <TextField
                id="email"
                label="Email"
                type="email"
                margin="dense"
                // onChange={this.handleTextInput}
              />
              <TextField
                id="password"
                label="Password"
                type="password"
                margin="dense"
                // onChange={this.handleTextInput}
              />
              <span
                onClick={this.forgotPasswordHandler}
                className="login-form__span"
              >
                Forgot password?
              </span>
              <Button
                className="login-form__button"
                variant="contained"
                // disabled={this.state.isLoading}
                // disableElevation
                // onClick={() => this.login()}
              >
                {"LOGIN"}
              </Button>
              {this.state.formType}
            </form>
          </div>
        );
        break;
      case 1:
        form = <div>Register</div>;
        break;
      case 2:
        form = <div>Reset Password</div>;
        break;
      default:
        break;
    }
    return form;
  }
}

export default Login;
