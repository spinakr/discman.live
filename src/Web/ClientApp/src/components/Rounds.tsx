import React, { useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { ApplicationState } from "../store";
import * as LoginStore from "../store/Login";

const mapState = (state: ApplicationState) => {
  return {
    login: state.login,
    rounds: state.rounds && state.rounds.rounds,
  };
};

const connector = connect(mapState, LoginStore.actionCreators);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {};

const Rounds = (props: Props) => (
  <ul>
    {props.rounds &&
      props.rounds.map((r) => (
        <li key={r.id}>
          {r.courseName} - {r.startTime}
        </li>
      ))}
  </ul>
);

export default connector(Rounds);
