import * as React from "react";
import { Route } from "react-router";
import Layout from "./components/Layout";
import Home from "./components/Home";
import Round from "./components/Round/Round";
import Courses from "./components/Courses/Courses";

export default () => (
  <Layout>
    <Route exact path="/" component={Home} />
    <Route exact path="/rounds/:roundId" component={Round} />
    <Route exact path="/courses/:courseId?" component={Courses} />
  </Layout>
);
