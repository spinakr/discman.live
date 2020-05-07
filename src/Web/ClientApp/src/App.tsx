import * as React from "react";
import { Route } from "react-router";
import Layout from "./components/Layout";
import Home from "./components/Home";
import Round from "./components/Round/Round";

export default () => (
  <Layout>
    <Route exact path="/" component={Home} />
    <Route exact path="/rounds/:roundId" component={Round} />
  </Layout>
);
