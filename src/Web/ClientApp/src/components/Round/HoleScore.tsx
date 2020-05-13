import React from "react";
import { Round, HoleScore } from "../../store/Rounds";

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
    ([] as HoleScore[]);

  const holeScore = playerScores.find((s) => s.hole.number === activeHole);

  return (
    <div style={{ margin: "10px" }}>
      <h2 className="subtitle has-text-centered">
        Hole {holeScore?.hole.number}
      </h2>
      <div className="columns is-centered is-mobile">
        <span className="column has-text-centered">
          <h6 className="title is-6">Par</h6>
          {holeScore?.hole.par}
        </span>
        <span className="column has-text-centered">
          <h6 className="title is-6" data-tooltip="Distance/length of hole">
            Distance
          </h6>
          {holeScore?.hole.distance}m
        </span>
      </div>
      <div className="columns is-centered is-mobile">
        <span className="column has-text-centered ">
          <h6
            className="title is-6 has-tooltip-multiline has-tooltip-right"
            data-tooltip="Average score among all playerson this hole"
          >
            Average
          </h6>
          {holeScore?.hole.average}
        </span>
        <span className="column has-text-centered">
          <h6
            className="title is-6  has-tooltip-multiline"
            data-tooltip="Difficulty rating - 1 is the hardest played hole "
          >
            Rating
          </h6>
          {holeScore?.hole.rating}
        </span>
      </div>
      <table className="table is-fullwidth is-bordered">
        <thead>
          <tr>
            {round.playerScores.map((p) => (
              <th
                key={p.playerName}
                className={
                  p.playerName === username ? "has-background-light" : ""
                }
              >
                {p.playerName}
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
