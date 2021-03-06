import React, { useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { ApplicationState } from "../../store";
import * as RoundsStore from "../../store/Rounds";
import { useParams } from "react-router";
import RoundScoreCard from "./RoundScoreCard";
import HoleScoreSelector from "./HoleScoreSelectorNew";
import WindowFocusHandler from "./WindowFocusHandler";
import RoundSummary from "./RoundSummary";
import HoleScore from "./HoleScoreNew";
import RoundScoreCardModal from "./RoundScoreCardModal";
import ScoreAnimations from "./ScoreAnimations";
import NavMenu from "../NavMenu";
import Colors from "../../colors";
import SignRound from "./SignRound";

const mapState = (state: ApplicationState) => {
  return {
    user: state.user,
    round: state.rounds?.round,
    playersStats: state.rounds?.playerCourseStats || [],
    scoreCardOpen: state.rounds?.scoreCardOpen,
    // activeHole: state.rounds?.activeHole,
    activeHoleIndex: state.rounds?.activeHoleIndex,
    finishedRoundStats: state.rounds?.finishedRoundStats || [],
  };
};

const connector = connect(mapState, RoundsStore.actionCreators);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {};

// const calculateDurationString = (round: Round) => {
//   if (round.isCompleted && round.completedAt === "0001-01-01T00:00:00")
//     return "";
//   const durationMinutes = round.roundDuration;
//   const hours = durationMinutes / 60;
//   const rhours = Math.floor(hours);
//   const minutes = (hours - rhours) * 60;
//   const rminutes = Math.round(minutes);

//   const hourPart = rhours !== 0 ? `${rhours} h ` : "";
//   const minPart = `${rminutes} min`;

//   return `${hourPart}${minPart}`;
// };

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
    activeHoleIndex,
    fetchRound,
    fetchStatsOnCourse,
    fetchUserStats,
    finishedRoundStats,
  } = props;
  let { roundId } = useParams<{ roundId: string }>();
  const roundCompleted = round?.isCompleted;
  useEffect(() => {
    if (!roundId) return;
    fetchRound(roundId as string);
    fetchStatsOnCourse(roundId);
    roundCompleted && fetchUserStats(roundId);
  }, [fetchRound, fetchStatsOnCourse, fetchUserStats, roundCompleted, roundId]);

  const allScoresSet = round?.playerScores.every((p) =>
    p.scores.every((s) => s.strokes !== 0)
  );
  if (!round) return null;

  const isPartOfRound = round?.playerScores.some(
    (s) => s.playerName === props.user?.user?.username
  );

  return (
    <div
      className="is-flex is-flex-direction-column "
      style={{ height: "100%" }}
    >
      <nav
        className="navbar is-light level is-mobile mb-0 is-flex"
        style={{ backgroundColor: Colors.navbar }}
      >
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
          <NavMenu />
        </div>
      </nav>
      <>
        {roundCompleted || !isPartOfRound ? (
          <RoundSummary
            round={round}
            finishedRoundStats={finishedRoundStats}
            username={props.user?.user?.username || ""}
          />
        ) : (
          <>
            {activeHoleIndex === -1 && isPartOfRound ? ( //all holes registered, show scorecard + complete button
              <div className="has-text-centered pt-6 mx-1">
                <RoundScoreCard
                  username={props.user?.user?.username || ""}
                  round={round}
                  activeHole={activeHoleIndex}
                  setActiveHole={props.setActiveHole}
                  closeDialog={() => props.setScorecardOpen(false)}
                  playersStats={props.playersStats}
                />
                {allScoresSet && isPartOfRound && (
                  <SignRound
                    completeRound={props.completeRound}
                    signatures={round.signatures}
                    username={props.user?.user?.username || ""}
                  />
                )}
              </div>
            ) : (
              //regular live view, hole scores and score selctor
              <>
                <HoleScore
                  username={props.user?.user?.username || ""}
                  round={round}
                  activeHole={activeHoleIndex || 0}
                  setActiveHole={props.setActiveHole}
                  playersStats={props.playersStats}
                />
                <HoleScoreSelector />
              </>
            )}
            {props.scoreCardOpen && (
              <RoundScoreCardModal
                username={props.user?.user?.username || ""}
                round={round}
                activeHole={activeHoleIndex || 0}
                setActiveHole={props.setActiveHole}
                closeDialog={() => props.setScorecardOpen(false)}
                playersStats={props.playersStats}
              />
            )}
            <WindowFocusHandler />
            <ScoreAnimations />
          </>
        )}
      </>
    </div>
  );
};

export default connector(RoundComponent);
