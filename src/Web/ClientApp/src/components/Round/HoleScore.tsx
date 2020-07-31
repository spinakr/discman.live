import React from "react";
import { Round } from "../../store/Rounds";

export interface ScoreCardProps {
  username: string;
  round: Round;
  activeHole: number;
  setActiveHole: (hole: number) => void;
}

const HoleScoreComponent = ({
  username,
  round,
  activeHole,
  setActiveHole,
}: ScoreCardProps) => {
  const playerScores =
    round.playerScores.find((p) => p.playerName === username)?.scores ||
    round.playerScores[0].scores;

  const holeScore = playerScores.find((s) => s.hole.number === activeHole);

  return (
    <div style={{ margin: "10px" }}>
      <h2 className="subtitle has-text-centered">
        Hole {holeScore?.hole.number}
      </h2>
      <div className="tour-stats">
        <div className="columns is-centered is-mobile">
          <span className="column has-text-centered">
            <h6 className="title is-6">Par</h6>
            {holeScore?.hole.par}
          </span>
          <span className="column has-text-centered">
            <h6 className="title is-6">Distance</h6>
            {holeScore?.hole.distance}m
          </span>
        </div>
        <div className="columns is-centered is-mobile">
          <span className="column has-text-centered ">
            <h6 className="title is-6">Average</h6>
            {holeScore?.hole.average.toFixed(1)}
          </span>
          <span className="column has-text-centered">
            <h6 className="title is-6 ">Rating</h6>
            {holeScore?.hole.rating}
          </span>
        </div>
      </div>
      <br />
      <table className="table is-fullwidth is-bordered tour-holeScores">
        <thead>
          <tr>
            {round.playerScores.map((p) => (
              <th
                key={p.playerName}
                className={
                  p.playerName === username ? "has-background-light" : ""
                }
              >
                {p.playerName} (
                {p.scores.reduce((total, score) => {
                  return total + score.relativeToPar;
                }, 0)}
                )
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {round.playerScores.map((p) => {
              return (
                <td
                  key={p.playerName}
                  className={
                    p.playerName === username ? "has-background-light" : ""
                  }
                >
                  {p.scores.find((s) => s.hole.number === activeHole)?.strokes}
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default HoleScoreComponent;
