/*!

=========================================================
* Argon Dashboard React - v1.2.2
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import { useLocation, Route, Switch, Redirect } from "react-router-dom";
import { Container } from "reactstrap";
import AdminFooter from "components/Footers/AdminFooter.js";
import Selector from "views/Selector.js";
import {getSearchKeys} from "api.js";

import routes from "routes.js";

const Data = (props) => {
  const mainContent = React.useRef(null);
  const location = useLocation();

  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContent.current.scrollTop = 0;
  }, [location]);

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/data" && prop.path === "/index") {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      } else if (prop.layout === "/data" && prop.path === "/event") {
        return (
          <Route
            path={prop.layout + prop.path}
            render={({ match: { url } }) => (
              <>
                <Route path={`${url}/:id/:id`} component={prop.component} exact />
                <Route path={`${url}/:id/:id/:id`} component={Selector} />
              </>
            )}
          />
        );
      } else {
        return null;
      }
    });
  };

  const getBrandText = (path) => {
    for (let i = 0; i < routes.length; i++) {
      if (
        props.location.pathname.indexOf(routes[i].layout + routes[i].path) !==
        -1
      ) {
        return routes[i].name;
      }
    }
    return "Brand";
  };

  return (
    <>
      <div className="main-content" ref={mainContent}>
        <Switch>
          {getRoutes(routes)}
          <Redirect from="*" to="/data/index" />
        </Switch>
        <Container fluid>
          <AdminFooter />
        </Container>
      </div>
    </>
  );
};

export default Data;
