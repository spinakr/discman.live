import React from "react";
import { PlayerCourseStats, PlayerScore } from "../../store/Rounds";

const RoundPredictions = ({
  playerStats,
  playerRoundScores,
}: {
  playerStats: PlayerCourseStats;
  playerRoundScores: PlayerScore;
}) => {
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
    (playerRoundScores?.scores &&
      playerRoundScores.scores.reduce((total, score) => {
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
      <div className="columns is-centered is-marginless is-mobile">
        <span className="column has-text-centered ">
          <span className="title is-6 ">Score</span>
          <br />
          <span className="p-1 is-size-5">
            {currentScore > 0 ? "+" : ""}
            {currentScore}
          </span>
        </span>
        <span className="column has-text-centered">
          <span className="title is-6 ">Vs. Avg.</span>
          <br />
          <span
            className={`p-1 is-size-5 ${
              versusAverage > 0
                ? "has-background-danger"
                : "has-background-primary"
            }`}
          >
            {versusAverage > 0 ? "+" : ""}
            {versusAverage}
          </span>
        </span>
        <span className="column has-text-centered ">
          <span className="title is-6 ">Predicted</span>
          <br />
          <span
            className={`p-1 is-size-5 ${
              predictedFinalScore - (playerStats?.courseAverage || 0) > 0
                ? "has-background-danger"
                : "has-background-primary"
            }`}
          >
            {predictedFinalScore > 0 ? "+" : ""}
            {predictedFinalScore}
          </span>
        </span>
      </div>
    </>
  );
};

export default RoundPredictions;
