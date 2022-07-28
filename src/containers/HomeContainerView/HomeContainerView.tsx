import React from "react";
import Notfound from "@src/pages/NotFound";
import { Route, Switch } from "react-router-dom";

import DashboardPage from "@pages/DashboardPage"
import PrivateLayout from "@layouts/PrivateLayout";
import PrivateRoute from "@src/routes/PrivateRoute";

const HomeContainerView: React.FC = () => {
    return (
        <PrivateLayout>
            <Switch>
                <PrivateRoute path={"/dashboard"} component={DashboardPage} />

                <Route>
                    <Notfound />
                </Route>
            </Switch>
        </PrivateLayout>
    );
};

export default HomeContainerView;
