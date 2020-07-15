import * as React from "react";
import { Route } from "react-router";
import Layout from "./components/Layout";
import Home from "./components/Home";
import Round from "./components/Round/Round";
import Courses from "./components/Courses/Courses";
import User from "./components/User/User";
import Friends from "./components/User/Friends";

export default () => (
  <Layout>
    <Route exact path="/" component={Home} />
    <Route exact path="/rounds/:roundId" component={Round} />
    <Route
      exact
      path="/courses/:courseName?/:courseLayout?"
      component={Courses}
    />
    <Route exact path="/user" component={User} />
    <Route exact path="/users/:username" component={User} />
    <Route exact path="/friends" component={Friends} />
  </Layout>
);
