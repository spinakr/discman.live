import React, { useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { ApplicationState } from "../store";
import * as RoundsStore from "../store/Rounds";
import { useParams } from "react-router";
import RoundScoreCard from "./RoundScoreCard";
import HoleScoreSelector from "./HoleScoreSelector";
import WindowFocusHandler from "./WindowFocusHandler";
import Tour from "./Tour";

const mapState = (state: ApplicationState) => {
  return {
    login: state.login,
    round: state.rounds?.round,
    activeHole: state.rounds?.activeHole,
  };
};

const connector = connect(mapState, RoundsStore.actionCreators);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {};

const Round = (props: Props) => {
  const { round, activeHole, fetchRound } = props;
  let { roundId } = useParams();
  useEffect(() => {
    fetchRound(roundId as string);
  }, [fetchRound, roundId]);

  return (
    <>
      <Tour start={round} />
      <h1 className="title">{props.round && props.round.courseName}</h1>
      <h2 className="subtitle">
        {props.round && new Date(props.round.startTime).toLocaleDateString()}
      </h2>
      {round && activeHole && (
        <RoundScoreCard
          round={round}
          activeHole={activeHole}
          setActiveHole={props.setActiveHole}
        />
      )}
      <hr />
      <HoleScoreSelector />
      <WindowFocusHandler />
    </>
  );
};

export default connector(Round);
