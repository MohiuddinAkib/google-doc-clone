import React from "react";
import { useAuth } from "@hooks/useAuth";
import { Redirect, Route, RouteProps } from "react-router-dom";

interface Props extends RouteProps {
  component: React.ComponentClass<any> | React.FC<any>;
}

const PublicRoute: React.FC<Props> = ({ component: Component, ...rest }) => {
  const { isAuthenticated } = useAuth();

  console.log("isAuthenticated", isAuthenticated)

  return (
    <Route
      {...rest}
      render={({ location, history }) =>
        !isAuthenticated ? (
          <Component />
        ) : (
          <Redirect
            to={(history.location.state as Record<string, string>)?.next || "/"}
          />
        )
      }
    />
  );
};

export default PublicRoute;
