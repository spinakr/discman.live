import React from "react";
import { Round, PlayerCourseStats } from "../../store/Rounds";

export interface ScoreCardProps {
  username: string;
  round: Round;
  activeHole: number;
  setActiveHole: (hole: number) => void;
  playersStats: PlayerCourseStats[];
}

const HoleScoreComponent = ({
  username,
  round,
  activeHole,
  setActiveHole,
  playersStats,
}: ScoreCardProps) => {
  const playerScores =
    round.playerScores.find((p) => p.playerName === username)?.scores ||
    round.playerScores[0].scores;

  const holeScore = playerScores.find((s) => s.hole.number === activeHole);

  const playerStats = playersStats.find((s) => s.playerName === username);
  const playersBirdies = playersStats.map((p) => {
    return {
      name: p.playerName,
      holeBirdied: p.holeStats.find((h) => h.holeNumber === activeHole)?.birdie,
    };
  });

  const holeStats =
    playerStats?.holeStats &&
    playerStats.holeStats.find((s) => s.holeNumber === activeHole);

  return (
    <div className="pt-2">
      {/* <h2 className="subtitle has-text-centered">
        {holeStats && holeStats.birdie && (
          <span className="icon is-small">
            <i className="fas fa-dove"></i>
          </span>
        )}
      </h2> */}
      <div className="tour-stats">
        <div className="columns is-centered is-mobile">
          <span className="column has-text-centered">
            <h6 className="title is-6">Hole</h6>
            {holeScore?.hole.number}
          </span>
          <span className="column has-text-centered">
            <h6 className="title is-6">Par</h6>
            {holeScore?.hole.par}
          </span>
          <span className="column has-text-centered ">
            <h6 className="title is-6">Avg.</h6>
            {holeScore?.hole.average.toFixed(1)}
          </span>
          <span className="column has-text-centered">
            <h6 className="title is-6 ">Rating</h6>
            {holeScore?.hole.rating}
          </span>
        </div>
      </div>
      <br />
      <div className="table-container">
        <table className="table is-fullwidth is-bordered tour-holeScores">
          <thead>
            <tr>
              {round.playerScores.map((p) => (
                <th
                  style={{
                    minWidth: "75px",
                    maxWidth: "75px",
                    overflow: "hidden",
                  }}
                  key={p.playerName}
                  className={
                    p.playerName === username
                      ? "has-background-light has-text-centered"
                      : "has-text-centered"
                  }
                >
                  {p.playerName}
                  <br />(
                  {p.scores.reduce((total, score) => {
                    return total + score.relativeToPar;
                  }, 0)}
                  )
                  {playersBirdies.find((x) => x.name === p.playerName)
                    ?.holeBirdied && (
                    <span className="icon is-small">
                      <i className="fas fa-dove"></i>
                    </span>
                  )}
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
                      p.playerName === username
                        ? "has-background-light has-text-centered"
                        : "has-text-centered"
                    }
                  >
                    {
                      p.scores.find((s) => s.hole.number === activeHole)
                        ?.strokes
                    }
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HoleScoreComponent;
