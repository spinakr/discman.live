import React, { useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { ApplicationState } from "../../store";
import * as RoundsStore from "../../store/Rounds";
import { useParams } from "react-router";
import RoundScoreCard from "./RoundScoreCard";
import HoleScoreSelector from "./HoleScoreSelector";
import WindowFocusHandler from "./WindowFocusHandler";
import RoundSummary from "./RoundSummary";
import { Round } from "../../store/Rounds";
import HoleScore from "./HoleScore";
import RoundScoreCardModal from "./RoundScoreCardModal";
import ScoreAnimations from "./ScoreAnimations";
import Spectators from "./Spectators";

const mapState = (state: ApplicationState) => {
  return {
    user: state.user,
    round: state.rounds?.round,
    playersStats: state.rounds?.playerCourseStats || [],
    scoreCardOpen: state.rounds?.scoreCardOpen,
    activeHole: state.rounds?.activeHole,
    finishedRoundStats: state.rounds?.finishedRoundStats || [],
  };
};

const connector = connect(mapState, RoundsStore.actionCreators);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {};

const calculateDurationString = (round: Round) => {
  if (round.isCompleted && round.completedAt === "0001-01-01T00:00:00")
    return "";
  const durationMinutes = round.roundDuration;
  const hours = durationMinutes / 60;
  const rhours = Math.floor(hours);
  const minutes = (hours - rhours) * 60;
  const rminutes = Math.round(minutes);

  const hourPart = rhours !== 0 ? `${rhours} h ` : "";
  const minPart = `${rminutes} min`;

  return `${hourPart}${minPart}`;
};

const toDateString = (date: Date) => {
  const dateTimeFormat = new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  });
  const [
    { value: month },
    ,
    { value: day },
    // { value: year },
    ,
  ] = dateTimeFormat.formatToParts(date);

  return `${day}. ${month.toLowerCase()}`;
};

const RoundComponent = (props: Props) => {
  const {
    round,
    activeHole,
    fetchRound,
    fetchStatsOnCourse,
    fetchUserStats,
    finishedRoundStats,
  } = props;
  let { roundId } = useParams();
  const roundCompleted = round?.isCompleted;
  useEffect(() => {
    if (!roundId) return;
    fetchRound(roundId as string);
    fetchStatsOnCourse(roundId);
    roundCompleted && fetchUserStats(roundId);
  }, [fetchRound, fetchStatsOnCourse, fetchUserStats, roundCompleted, roundId]);

  const renderRound = (round: Round, activeHole: number) => {
    if (roundCompleted) {
      return (
        <RoundSummary
          round={round}
          finishedRoundStats={finishedRoundStats}
          username={props.user?.user?.username || ""}
        />
      );
    }
    return (
      <>
        {props.activeHole === 100 ? (
          <div className="has-text-centered pt-6">
            <RoundScoreCard
              username={props.user?.user?.username || ""}
              round={round}
              activeHole={activeHole}
              setActiveHole={props.setActiveHole}
              closeDialog={() => props.setScorecardOpen(false)}
              playersStats={props.playersStats}
            />
          </div>
        ) : (
          <HoleScore
            username={props.user?.user?.username || ""}
            round={round}
            activeHole={activeHole}
            setActiveHole={props.setActiveHole}
            playersStats={props.playersStats}
          />
        )}
        {props.scoreCardOpen && (
          <RoundScoreCardModal
            username={props.user?.user?.username || ""}
            round={round}
            activeHole={activeHole}
            setActiveHole={props.setActiveHole}
            closeDialog={() => props.setScorecardOpen(false)}
            playersStats={props.playersStats}
          />
        )}
        <hr />
        <HoleScoreSelector />
        <WindowFocusHandler />
        <ScoreAnimations />
        {/* <Spectators spectators={round.spectators} /> */}
      </>
    );
  };
  return round ? (
    <>
      {/* <Tour start={round} /> */}
      <nav className="navbar is-light level is-mobile mb-0">
        <div className="level-item has-text-centered">
          <div className="is-size-7">
            {toDateString(new Date(round.startTime))} &nbsp;
          </div>
        </div>
        <div className="level-item has-text-centered">
          <div className="is-size-5">
            {`${round.courseName} ` || round?.roundName}
          </div>
        </div>
        <div className="level-item has-text-centered">
          <div className="is-size-7">
            <i>{calculateDurationString(round)}</i>
          </div>
        </div>
      </nav>
      <div className="has-text-centered py-0"></div>

      {activeHole && renderRound(round, activeHole)}
    </>
  ) : null;
};

export default connector(RoundComponent);
