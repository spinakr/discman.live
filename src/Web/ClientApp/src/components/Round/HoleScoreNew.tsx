import React from "react";
import colors from "../../colors";
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
  const activePlayerScores = round.playerScores.find(
    (p) => p.playerName === username
  );
  if (!activePlayerScores) return null;
  const playerScores =
    activePlayerScores?.scores || round.playerScores[0].scores;

  const holeScore = playerScores[activeHole];

  const playersBirdies = playersStats.map((p) => {
    return {
      name: p.playerName,
      holeBirdied: p.holeStats[activeHole].birdie,
    };
  });

  const courseHoles = playerScores;
  const currentHole = courseHoles[activeHole];
  const nextHole =
    courseHoles.length - 1 >= activeHole + 1
      ? courseHoles[activeHole + 1]
      : null;
  const prevHole = activeHole - 1 > -1 ? courseHoles[activeHole - 1] : null;

  const playersToDisplay =
    round.playerScores.length > 4 ? [activePlayerScores] : round.playerScores;

  return (
    <div className="pt-1 pb-0">
      <div className="tour-stats">
        <div className="columns is-centered is-mobile">
          <span className="column has-text-centered pb-0">
            <h6 className="title is-6">Hole</h6>
            {holeScore?.hole.number}
          </span>
          <span className="column has-text-centered pb-0">
            <h6 className="title is-6">Par</h6>
            {holeScore?.hole.par}
          </span>
          <span className="column has-text-centered  pb-0">
            <h6 className="title is-6">Avg.</h6>
            {holeScore?.hole.average.toFixed(1)}
          </span>
          <span className="column has-text-centered pb-0">
            <h6 className="title is-6 ">Rating</h6>
            {holeScore?.hole.rating}
          </span>
        </div>
      </div>
      <br />
      <div className="table-container">
        <table
          className="table is-fullwidth is-narrower"
          style={{ backgroundColor: colors.table }}
        >
          <thead>
            <tr>
              <td></td>
              <td></td>
              {prevHole && (
                <th
                  className="has-text-centered px-2"
                  onClick={() => setActiveHole(activeHole - 1)}
                >
                  {prevHole.hole.number}
                </th>
              )}
              <th className="has-text-centered bordered-cell px-4">
                {currentHole.hole.number}
              </th>
              {nextHole && (
                <th
                  className="has-text-centered px-2"
                  onClick={() => setActiveHole(activeHole + 1)}
                >
                  {nextHole.hole.number}
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {playersToDisplay.map((p, i) => {
              const currentHole = p.scores[activeHole];
              const nextHole =
                p.scores.length - 1 >= activeHole + 1
                  ? p.scores[activeHole + 1]
                  : null;
              const prevHole =
                activeHole - 1 > -1 ? p.scores[activeHole - 1] : null;

              return (
                <tr
                  key={i}
                  className={p.playerName === username ? "active-user-row" : ""}
                >
                  <td className="px-0 has-text-centered">
                    <span className="is-size-5">{p.playerEmoji}</span>
                  </td>
                  <td
                    style={{
                      minWidth: "75px",
                      maxWidth: "75px",
                      overflow: "hidden",
                    }}
                    className="has-text-centered"
                  >
                    &nbsp;
                    {p.playerName} (
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
                  </td>
                  {prevHole && (
                    <td
                      className="has-text-centered px-1 has-text-grey-light"
                      onClick={() => setActiveHole(activeHole - 1)}
                    >
                      {prevHole.strokes}
                    </td>
                  )}
                  <td className="has-text-centered bordered-cell is-size-5">
                    {currentHole.strokes}
                  </td>

                  {nextHole && (
                    <td
                      className="has-text-centered px-1 has-text-grey-light"
                      onClick={() => setActiveHole(activeHole + 1)}
                    >
                      {nextHole.strokes}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HoleScoreComponent;
