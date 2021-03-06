import * as React from "react";
import { Redirect, Route } from "react-router-dom";
import { AuthService } from "../services/auth";

export const PrivateRoute = ({
  component: Component,
  notAllowed = [],
  ...rest
}) => (
  <Route
    {...rest}
    render={props =>
      AuthService.isAuthenticated() ? (
        notAllowed.indexOf(AuthService.getRole()) === -1 ? (
          <Component {...props} />
        ) : (
          <Redirect to="/" />
        )
      ) : (
        <Redirect to={{ pathname: "/" }} />
      )
    }
  />
);
