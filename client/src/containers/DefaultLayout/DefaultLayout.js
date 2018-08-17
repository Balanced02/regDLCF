import React, { Component } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import { Container } from "reactstrap";
import { callApi } from "../../utils";
import { login } from "../../actions/auth";
import PageLoading from "../../components/loading";

import {
  AppAside,
  AppBreadcrumb,
  AppFooter,
  AppHeader,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarMinimizer,
  AppSidebarNav
} from "@coreui/react";
// sidebar nav config
import navigation from "../../_nav";
// routes config
import routes from "../../routes";
import DefaultAside from "./DefaultAside";
import DefaultFooter from "./DefaultFooter";
import DefaultHeader from "./DefaultHeader";

class DefaultLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ready: this.props.authenticated,
      redirect: false
    };
  }
  componentWillMount() {
    if (!this.props.authenticated) {
      callApi("/me")
        .then(response => {
          if (response.authenticated) {
            this.props.dispatch(login(response.user));
            this.setState({
              ready: true,
              redirect: false
            });
          } else {
            this.setState({
              redirect: true
            });
          }
        })
        .catch(err => {
          this.setState({
            redirect: false
          });
        });
    } else {
      this.setState({
        ready: true
      });
    }
  }
  render() {
    return this.state.ready ? (
      <div className="app">
        <AppHeader fixed>
          <DefaultHeader />
        </AppHeader>{" "}
        <div className="app-body">
          <AppSidebar fixed display="lg">
            <AppSidebarHeader />
            <AppSidebarForm />
            <AppSidebarNav navConfig={navigation} {...this.props} />{" "}
            <AppSidebarFooter />
            <AppSidebarMinimizer />
          </AppSidebar>{" "}
          <main className="main">
            <AppBreadcrumb appRoutes={routes} />{" "}
            <Container fluid>
              <Switch>
                {" "}
                {routes.map((route, idx) => {
                  return route.component ? (
                    <Route
                      key={idx}
                      path={route.path}
                      exact={route.exact}
                      name={route.name}
                      render={props => <route.component {...props} />}
                    />
                  ) : null;
                })}{" "}
                <Redirect from="/" to="/dashboard" />
              </Switch>{" "}
            </Container>{" "}
          </main>{" "}
          <AppAside fixed hidden>
            <DefaultAside />
          </AppAside>{" "}
        </div>{" "}
        <AppFooter>
          <DefaultFooter />
        </AppFooter>{" "}
      </div>
    ) : !this.state.redirect ? (
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          marginTop: "-50px",
        }}
      >
        {" "}
        <PageLoading />{" "}
      </div>
    ) : (
      <Redirect
        to="/login
        "
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    authenticated: state.auth.authenticated
  };
};

export default connect(mapStateToProps)(DefaultLayout);
