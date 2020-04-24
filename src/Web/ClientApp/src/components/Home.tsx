import * as React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RouteComponentProps } from "react-router";
import { ApplicationState } from "../store";
import Login from "./Login";
import Rounds from "./Rounds";
import * as RoundsStore from "../store/Rounds";

const mapState = (state: ApplicationState) => {
  return {
    login: state.login,
    rounds: state.rounds && state.rounds.rounds,
  };
};

const connector = connect(mapState, RoundsStore.actionCreators);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & RouteComponentProps & {};

const Home = (props: Props) => {
  const { login, rounds, fetchLast5Rounds } = props;

  React.useEffect(() => {
    fetchLast5Rounds();
  }, [fetchLast5Rounds]);

  return (
    <div>
      {login && !login.loggedIn && <Login />}
      {rounds && <Rounds />}
    </div>
  );
};

export default connector(Home);
