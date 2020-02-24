import * as React from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";
import { AuthService } from "../services/auth";

export const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      AuthService.isAuthenticated() ? (
        <Component {...props} />
      ) : (
        <Redirect to={{ pathname: "/login" }} />
      )
    }
  />
);
