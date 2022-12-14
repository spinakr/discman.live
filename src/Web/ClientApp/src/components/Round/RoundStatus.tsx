/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { ApplicationState } from "../../store";
import * as RoundsStore from "../../store/Rounds";
import { Chart } from "react-charts";
import InformationDialogue from "../InformationDialogue";
import colors from "../../colors";

const mapState = (state: ApplicationState) => {
  return {
    user: state.user,
    round: state.rounds?.round,
    stats: state.rounds?.playerCourseStats,
  };
};

const connector = connect(mapState, RoundsStore.actionCreators);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {};

const RoundStatus = (props: Props) => {
  const { stats, user, round } = props;
  const [showDialog, setShowDialog] = useState(false);
  const [showPlayer, setShowPlayer] = useState(user?.user?.username);

  const playerStats = stats && stats.find((s) => s.playerName === showPlayer);

  const playerRoundScores =
    round && round.playerScores.find((s) => s.playerName === showPlayer);

  const roundScores = playerRoundScores && playerRoundScores?.scores;

  const data = React.useMemo(() => {
    let total = 0;
    return (
      playerStats && [
        {
          label: "Current",
          data:
            roundScores &&
            [[0, 0]].concat(
              roundScores
                .filter((s) => s.strokes !== 0)
                .map((s) => {
                  total += s.relativeToPar;
                  return [s.hole.number, total];
                })
            ),
        },
        {
          label: "Average Progression",
          data: [[0, 0]].concat(
            playerStats.averagePrediction.map((s, i) => [i + 1, s])
          ),
        },
      ]
    );
  }, [playerStats, roundScores]);
  const axes = React.useMemo(
    () => [
      { primary: true, type: "linear", position: "bottom" },
      { type: "linear", position: "left" },
    ],
    []
  );
  if (!playerStats || +playerStats.roundsPlayed < 1) return null;

  var lastScoredHoleIndex = 0;
  playerRoundScores &&
    playerRoundScores.scores.forEach((s, i) => {
      if (lastScoredHoleIndex !== 0) return;
      if (s.strokes === 0) {
        lastScoredHoleIndex = i - 1;
      }
    });

  const predLength =
    (playerStats && playerStats.averagePrediction.length - 1) || 0;

  const currentScore =
    (roundScores &&
      roundScores.reduce((total, score) => {
        return total + score.relativeToPar;
      }, 0)) ||
    0;

  const currentAverage =
    playerStats?.averagePrediction[
      lastScoredHoleIndex === 0 ? predLength : lastScoredHoleIndex
    ];

  const versusAverage = Math.ceil(currentScore - (currentAverage || 0));

  const predictedFinalScore =
    (lastScoredHoleIndex === 0
      ? currentScore
      : (currentScore &&
          playerStats &&
          Math.ceil(
            currentScore +
              playerStats.holeAverages
                .filter((h, i) => i > lastScoredHoleIndex)
                .reduce((total, score) => {
                  return total + score;
                }, 0)
          )) ||
        0) || 0;

  return (
    <>
      {showDialog && (
        <div className={showDialog ? "modal is-active" : "modal"}>
          <div onClick={() => setShowDialog(false)}>
            <div className="modal-background"></div>
          </div>
          <div className="modal-card">
            {/* <header className="modal-card-head">
              <p className="modal-card-title">Round Status</p>
            </header> */}
            <section
              className="modal-card-body px-2"
              style={{ backgroundColor: colors.background }}
            >
              <div className="has-text-centered">
                <span className="title is-5">Current Score</span>
                <InformationDialogue
                  title="Round Status"
                  text={`Shows how the current round compares to your previous rounds on the course.

The blue line shows your average round progression based on averages on each hole. The red line is the current round.`}
                />{" "}
                <br />
                <span className="is-size-3">
                  {currentScore > 0 ? "+" : ""}
                  {currentScore}
                </span>
              </div>
              <div className="columns is-centered is-marginless is-mobile">
                <span className="column has-text-centered ">
                  <span className="title is-6 ">Predicted Score</span>
                  <br />
                  <p
                    className={`${
                      predictedFinalScore - (playerStats?.courseAverage || 0) >
                      0
                        ? "has-background-danger"
                        : "has-background-primary"
                    }`}
                  >
                    {predictedFinalScore > 0 ? "+" : ""}
                    {predictedFinalScore}
                  </p>
                </span>
                <span className="column has-text-centered">
                  <span className="title is-6 ">Versus Average</span>
                  <br />
                  <p
                    className={`${
                      versusAverage > 0
                        ? "has-background-danger"
                        : "has-background-primary"
                    }`}
                  >
                    {versusAverage > 0 ? "+" : ""}
                    {versusAverage}
                  </p>
                </span>
              </div>
              <div className="columns is-centered is-mobile">
                <span className="column has-text-centered">
                  <h6 className="title is-6">Course Average</h6>
                  {playerStats?.courseAverage.toFixed(1)}
                </span>
                <span className="column has-text-centered">
                  <h6 className="title is-6">Course Record</h6>
                  {playerStats?.playerCourseRecord}
                </span>
              </div>
              <div style={{ width: "350px", height: "200px" }}>
                <Chart data={data} axes={axes} tooltip />
              </div>
            </section>
            {/* <footer className="modal-card-foot">
              <button className="button" onClick={() => setShowDialog(false)}>
                Close
              </button>
              {playersInRound && (
                <div className="field is-grouped">
                  <div className="control">
                    <div className="select is-primary">
                      <select
                        value={showPlayer}
                        onChange={(e) => setShowPlayer(e.target.value)}
                      >
                        {playersInRound.map((u) => (
                          <option key={u}>{u}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </footer> */}
          </div>
        </div>
      )}

      <a
        className="button pr-1 pl-3 is-small"
        onClick={() => setShowDialog(true)}
        style={{ backgroundColor: colors.button }}
      >
        <span className="icon">
          <i className="fas fa-lg fa-chart-line" aria-hidden="true"></i>
        </span>
        <span className="is-size-7">Status</span>
      </a>
    </>
  );
};

export default connector(RoundStatus);
