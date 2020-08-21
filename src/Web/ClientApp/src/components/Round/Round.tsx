import React, { useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { ApplicationState } from "../../store";
import * as RoundsStore from "../../store/Rounds";
import { useParams } from "react-router";
import RoundScoreCard from "./RoundScoreCard";
import HoleScoreSelector from "./HoleScoreSelector";
import WindowFocusHandler from "../WindowFocusHandler";
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
    scoreCardOpen: state.rounds?.scoreCardOpen,
    activeHole: state.rounds?.activeHole,
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
  const { round, activeHole, fetchRound, fetchStatsOnCourse } = props;
  let { roundId } = useParams();
  useEffect(() => {
    fetchRound(roundId as string);
    roundId && fetchStatsOnCourse(roundId);
  }, [fetchRound, fetchStatsOnCourse, roundId]);

  const renderRound = (round: Round, activeHole: number) => {
    if (round.isCompleted) {
      return <RoundSummary round={round} />;
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
        <ScoreAnimations />
        <Spectators spectators={round.spectators} />
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
