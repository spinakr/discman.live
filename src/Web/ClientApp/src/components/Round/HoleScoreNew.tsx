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

  const activePlayerScores = round.playerScores.find(
    (p) => p.playerName === username
  );

  //Create spectator view
  if (!activePlayerScores) return null;

  const playersToDisplay =
    round.playerScores.length > 4 ? [activePlayerScores] : round.playerScores;

  return (
    <div className="pt-1 pb-0">
      {/* <h2 className="subtitle has-text-centered">
        {holeStats && holeStats.birdie && (
          <span className="icon is-small">
            <i className="fas fa-dove"></i>
          </span>
        )}
      </h2> */}
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
              {activeHole > 1 && (
                <th
                  className="has-text-centered px-2"
                  onClick={() => setActiveHole(activeHole - 1)}
                >
                  {activeHole - 1}
                </th>
              )}
              <th className="has-text-centered bordered-cell px-4">
                {activeHole}
              </th>
              {activeHole < round.playerScores[0].scores.length && (
                <th
                  className="has-text-centered px-2"
                  onClick={() => setActiveHole(activeHole + 1)}
                >
                  {activeHole + 1}
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {playersToDisplay.map((p, i) => (
              <tr key={i}>
                <th className="px-0 has-text-centered">
                  <span className="is-size-5">{p.playerEmoji}</span>
                </th>
                <th
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
                </th>
                {activeHole > 1 && (
                  <td
                    className="has-text-centered px-1 has-text-grey-light"
                    onClick={() => setActiveHole(activeHole - 1)}
                  >
                    {
                      p.scores.find((s) => s.hole.number === activeHole - 1)
                        ?.strokes
                    }
                  </td>
                )}
                <td className="has-text-centered bordered-cell is-size-5">
                  {p.scores.find((s) => s.hole.number === activeHole)?.strokes}
                </td>

                {activeHole < round.playerScores[0].scores.length && (
                  <td
                    className="has-text-centered px-1 has-text-grey-light"
                    onClick={() => setActiveHole(activeHole + 1)}
                  >
                    {
                      p.scores.find((s) => s.hole.number === activeHole + 1)
                        ?.strokes
                    }
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HoleScoreComponent;
