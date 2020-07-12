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

  return `(${hourPart}${minPart})`;
};

const RoundComponent = (props: Props) => {
  const { round, activeHole, fetchRound } = props;
  let { roundId } = useParams();
  useEffect(() => {
    fetchRound(roundId as string);
  }, [fetchRound, roundId]);

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
      </>
    );
  };

  return (
    <>
      <Tour start={round} />
      <h1 className="title has-text-centered">
        {props.round &&
          (props.round.courseName || (
            <i className=" has-text-grey-light ">{props.round?.roundName}</i>
          ))}
      </h1>
      <h2 className="subtitle has-text-centered">
        {props.round && new Date(props.round.startTime).toLocaleDateString()}{" "}
        <i>{props.round && calculateDurationString(props.round)}</i>
      </h2>

      {/* <h6 className="subtitle is-6 has-text-centered">
        {props.round}
      </h6> */}

      {round && activeHole && renderRound(round, activeHole)}
    </>
  );
};

export default connector(RoundComponent);
