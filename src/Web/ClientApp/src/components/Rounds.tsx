import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { ApplicationState } from "../store";

const mapState = (state: ApplicationState) => {
  return {
    login: state.login,
    rounds: state.rounds && state.rounds.rounds,
  };
};

const connector = connect(mapState);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {};

const Rounds = (props: Props) => (
  <ul>
    {props.rounds &&
      props.rounds.map((r) => (
        <li key={r.id}>
          <a href={`/rounds/${r.id}`}>
            {r.courseName} - {r.startTime}
          </a>
        </li>
      ))}
  </ul>
);

export default connector(Rounds);
