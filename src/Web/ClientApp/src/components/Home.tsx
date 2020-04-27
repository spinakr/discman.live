import * as React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RouteComponentProps } from "react-router";
import { ApplicationState } from "../store";
import Login from "./Login";
import Rounds from "./Rounds";

const mapState = (state: ApplicationState) => {
  return {
    login: state.login,
  };
};

const connector = connect(mapState);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & RouteComponentProps & {};

const Home = (props: Props) => {
  const { login } = props;

  return (
    <div>
      {!login?.loggedIn && <Login />}
      {login?.loggedIn && <Rounds />}
    </div>
  );
};

export default connector(Home);
