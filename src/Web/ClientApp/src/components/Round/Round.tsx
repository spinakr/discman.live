import React, { useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { ApplicationState } from "../../store";
import * as RoundsStore from "../../store/Rounds";
import { useParams } from "react-router";
import RoundScoreCard from "./RoundScoreCard";
import HoleScoreSelector from "./HoleScoreSelector";
import WindowFocusHandler from "../WindowFocusHandler";
import Tour from "../Tour";
import RoundSummary from "./RoundSummary";
import { Round } from "../../store/Rounds";
import HoleScore from "./HoleScore";
import RoundScoreCardModal from "./RoundScoreCardModal";

const mapState = (state: ApplicationState) => {
  return {
    user: state.user,
    round: state.rounds?.round,
    scoreCardOpen: state.rounds?.scoreCardOpen,
    activeHole: state.rounds?.activeHole,
    playersCourseStats: state.rounds?.playerCourseStats,
  };
};

const connector = connect(mapState, RoundsStore.actionCreators);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {};

const RoundComponent = (props: Props) => {
  const { round, activeHole, fetchRound, fetchStatsOnCourse } = props;
  let { roundId } = useParams();
  useEffect(() => {
    fetchRound(roundId as string);
  }, [fetchRound, roundId]);
  useEffect(() => {
    if (!props.playersCourseStats && roundId) fetchStatsOnCourse(roundId);
  }, [fetchStatsOnCourse, props.playersCourseStats, roundId]);

  const renderRound = (round: Round, activeHole: number) => {
    if (round.isCompleted) {
      return (
        <RoundSummary
          round={round}
          playersCourseStats={props.playersCourseStats || []}
        />
      );
    }
    return (
      <>
        {props.activeHole === 100 ? (
          <RoundScoreCard
            username={props.user?.user?.username || ""}
            round={round}
            activeHole={activeHole}
            setActiveHole={props.setActiveHole}
            closeDialog={() => props.setScorecardOpen(false)}
          />
        ) : (
          <HoleScore
            username={props.user?.user?.username || ""}
            round={round}
            activeHole={activeHole}
            setActiveHole={props.setActiveHole}
          />
        )}
        {props.scoreCardOpen && (
          <RoundScoreCardModal
            username={props.user?.user?.username || ""}
            round={round}
            activeHole={activeHole}
            setActiveHole={props.setActiveHole}
            closeDialog={() => props.setScorecardOpen(false)}
          />
        )}
        <hr />
        <HoleScoreSelector />
        <WindowFocusHandler />
      </>
    );
  };

  return (
    <>
      <Tour start={round} />
      <h1 className="title has-text-centered">
        {props.round && props.round.courseName}
      </h1>
      <h2 className="subtitle has-text-centered">
        {props.round && new Date(props.round.startTime).toLocaleDateString()}
      </h2>
      {round && activeHole && renderRound(round, activeHole)}
    </>
  );
};

export default connector(RoundComponent);
