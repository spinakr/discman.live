import React, { useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { ApplicationState } from "../store";
import * as RoundsStore from "../store/Rounds";
import { useParams } from "react-router";
import RoundScoreCard from "./RoundScoreCard";
import HoleScoreSelector from "./HoleScoreSelector";

const mapState = (state: ApplicationState) => {
  return {
    login: state.login,
    rounds: state.rounds && state.rounds,
  };
};

const connector = connect(mapState, RoundsStore.actionCreators);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {};

const Round = (props: Props) => {
  const { rounds, fetchRound } = props;
  let { roundId } = useParams();
  useEffect(() => {
    fetchRound(roundId as string);
  }, [fetchRound, roundId]);

  return rounds && rounds.round ? (
    <div>
      <RoundScoreCard round={rounds.round} activeHole={rounds.activeHole} />
      <HoleScoreSelector />
    </div>
  ) : null;
};

export default connector(Round);
