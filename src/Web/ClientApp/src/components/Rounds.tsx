import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { ApplicationState } from "../store";
import * as RoundsStore from "../store/Rounds";
import { Round } from "../store/Rounds";

const mapState = (state: ApplicationState) => {
  return {
    login: state.login,
    rounds: state.rounds && state.rounds.rounds,
  };
};

const connector = connect(mapState, RoundsStore.actionCreators);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {};

const renderRound = (r: Round) => {
  let style = "list-item";
  const startTime = new Date(r.startTime);
  const startedAgo = Date.now().valueOf() - startTime.valueOf();
  const startedAgoMins = startedAgo / 1000 / 60;
  if (startedAgoMins < 30) style += " has-text-primary has-text-weight-bold";
  return (
    <a className={style} key={r.id} href={`/rounds/${r.id}`}>
      {r.courseName} - <i>{new Date(r.startTime).toLocaleDateString()} </i>
    </a>
  );
};

const Rounds = (props: Props) => {
  const { fetchLast5Rounds } = props;
  React.useEffect(() => {
    fetchLast5Rounds();
  }, [fetchLast5Rounds]);

  return (
    <section className="section">
      <div className="list">
        {props.rounds && props.rounds.map(renderRound)}
      </div>
    </section>
  );
};

export default connector(Rounds);
