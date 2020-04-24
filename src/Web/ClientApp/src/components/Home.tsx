import * as React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RouteComponentProps } from "react-router";
import { ApplicationState } from "../store";
import Login from "./Login";
import Rounds from "./Rounds";

const mapState = (state: ApplicationState) => state.login;

const connector = connect(mapState);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & RouteComponentProps & {};

const Home = (props: Props) => (
  <div>
    {!props.loggedIn && <Login />}
    {true && <Rounds />}
  </div>
);

export default connector(Home);
