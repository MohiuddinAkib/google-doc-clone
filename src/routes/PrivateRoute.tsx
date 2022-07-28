import React from "react";
import { Role } from "@constants/role";
import { useAuth } from "@hooks/useAuth";
import { Redirect, Route, RouteProps } from "react-router-dom";

interface Props extends RouteProps {
    allowedRoles?: Role[];
    unauthorizedRedirectRoute?: string;
    component: React.ComponentClass<any> | React.FC<any>;
}

const PrivateRoute: React.FC<Props> = ({ allowedRoles, unauthorizedRedirectRoute, component: Component, ...rest }) => {
    const { isAuthenticated } = useAuth();

    return (
        <Route
            {...rest}
            render={({ location }) =>
                isAuthenticated ?
                    <Component />
                    : (
                        <Redirect
                            to={{
                                pathname: "/identity/login",
                                state: { next: location },
                            }}
                        />
                    )
            }
        />
    );
};

export default PrivateRoute;
