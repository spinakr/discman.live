import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { ApplicationState } from "../store";
import * as RoundsStore from "../store/Rounds";

const mapState = (state: ApplicationState) => {
  return {
    login: state.login,
    rounds: state.rounds && state.rounds.rounds,
  };
};

const connector = connect(mapState, RoundsStore.actionCreators);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {};

const Rounds = (props: Props) => {
  const { fetchLast5Rounds } = props;
  React.useEffect(() => {
    fetchLast5Rounds();
  }, [fetchLast5Rounds]);

  return (
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
};

export default connector(Rounds);
