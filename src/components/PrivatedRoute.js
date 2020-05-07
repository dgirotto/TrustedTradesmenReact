import * as React from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";
import { AuthService } from "../services/auth";

export const PrivateRoute = ({ component: Component, allowed, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      AuthService.isAuthenticated() ? (
        allowed.indexOf(AuthService.getRole()) !== -1 ? (
          <Component {...props} />
        ) : (
          <Redirect to="/" />
        )
      ) : (
        <Redirect to={{ pathname: "/login" }} />
      )
    }
  />
);
