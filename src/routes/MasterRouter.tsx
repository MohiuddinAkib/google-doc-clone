import React from "react";
import PublicRoute from "@src/routes/PublicRoute";
import LoginPage from "@pages/identity/LoginPage";
import PrivateRoute from "@src/routes/PrivateRoute";
import RegisterPage from "@pages/identity/RegisterPage";
import DocumentWritePage from "@pages/DocumentWritePage";
import HomeContainerView from "@containers/HomeContainerView";
import {
  Route,
  Switch,
  Redirect,
  BrowserRouter as Router,
} from "react-router-dom";


const MasterRouter: React.FC = () => {
  return (
    <Router>
      <Switch>
        <Redirect to={"/dashboard"} from={"/"} exact />

        <PublicRoute path={"/identity/login"} component={LoginPage} />
        <PublicRoute path={"/identity/register"} component={RegisterPage} />

        <PrivateRoute path={"/documents/:documentId/write"} component={DocumentWritePage} />

        <Route path={"/"}>
          <HomeContainerView />
        </Route>
      </Switch>
    </Router>
  );
};

export default MasterRouter;
