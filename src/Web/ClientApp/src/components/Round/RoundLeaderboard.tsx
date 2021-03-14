/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import colors, { scoreColorStyle } from "../../colors";
import { Round, HoleScore, PlayerScore } from "../../store/Rounds";

export interface RoundLeaderboardProps {
  round: Round;
  username: string;
}

const playerTotal = (playerScore: PlayerScore) => {
  return playerScore.scores.reduce((total, hole) => {
    return total + hole.relativeToPar;
  }, 0);
};

const renderScores = (
  playerScores: PlayerScore[],
  username: string,
  from: number,
  to: number,
  withTotals: boolean
) => {
  return (
    <table
      className="table is-narrow is-fullwidth my-0 mb-2"
      style={{ backgroundColor: colors.table }}
    >
      <thead>
        <tr>
          {withTotals && (
            <th>
              Hole
              <br />
              Par
            </th>
          )}
          {playerScores[0].scores.slice(from, to).map((s) => (
            <th key={s.hole.number}>
              {s.hole.number} <br />
              <i>{s.hole.par}</i>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {playerScores.map((p) => (
          <tr
            key={p.playerName}
            className={p.playerName === username ? "active-user-row" : ""}
          >
            {withTotals && (
              <td>
                {p.playerName}&nbsp;(
                {playerTotal(p)})
              </td>
            )}
            {p.scores.slice(from, to).map((s) => renderPlayerHoleScore(s))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const renderPlayerHoleScore = (s: HoleScore) => {
  return (
    <td
      className={scoreColorStyle(s.relativeToPar, s.strokeSpecs)}
      key={s.hole.number}
    >
      {s.strokes}
    </td>
  );
};

export default ({ round, username }: RoundLeaderboardProps) => {
  round.playerScores.sort((a, b) => {
    const atotal = playerTotal(a);
    const btotal = playerTotal(b);
    return atotal === btotal ? 0 : atotal < btotal ? -1 : 1;
  });

  const holesOnCourse = round.playerScores[0].scores.length;

  return (
    <>
      <table
        className="table is-marginless is-paddingless is-narrow is-fullwidth mt-2"
        style={{ backgroundColor: colors.table }}
      >
        <thead>
          <tr>
            <th></th>
            <th>Player</th>
            <th>Score</th>
            <th>Through</th>
          </tr>
        </thead>
        <tbody>
          {round.playerScores.map((s, i) => {
            return (
              <tr
                key={s.playerName}
                className={s.playerName === username ? "active-user-row" : ""}
              >
                <th>{i + 1}</th>
                <td>
                  {s.playerEmoji}
                  {s.playerName}
                </td>
                <td>
                  {playerTotal(s) >= 0 ? "+" : "-"}
                  {Math.abs(playerTotal(s))}
                </td>
                <td>
                  {s.scores.filter((s) => s.strokes !== 0).length} /{" "}
                  {holesOnCourse}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <br />
      {renderScores(round.playerScores, username, 0, 8, true)}
      {renderScores(round.playerScores, username, 8, 18, false)}
      {renderScores(round.playerScores, username, 19, 30, false)}
    </>
  );
};
