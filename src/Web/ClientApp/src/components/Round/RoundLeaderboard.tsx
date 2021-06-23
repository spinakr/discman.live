/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import colors, { scoreColorStyle } from "../../colors";
import { Round, HoleScore, PlayerScore } from "../../store/Rounds";
import { toBlob } from "html-to-image";

export interface RoundLeaderboardProps {
  round: Round;
  username: string;
}

const playerTotal = (playerScore: PlayerScore) => {
  return playerScore.scores.reduce((total, hole) => {
    return total + hole.relativeToPar;
  }, 0);
};

const renderScoresThight = (playerScores: PlayerScore[], username: string) => {
  return (
    <table
      className="table is-narrowest is-fullwidth my-0"
      style={{
        backgroundColor: colors.table,
      }}
    >
      <thead>
        <tr>
          <th>
            Hole
            <br />
            Par
          </th>
          {playerScores[0].scores.map((s) => (
            <th key={s.hole.number}>
              {s.hole.number < 10 ? "\u00A0\u00A0" : null}
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
            <td>
              {p.playerName}&nbsp;(
              {playerTotal(p)})
            </td>
            {p.scores.map((s) => renderPlayerHoleScore(s))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
const renderScoresPart = (
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
  const [showThight, setShowThight] = useState(false);
  const [cannotShare, setCannotShare] = useState(false);
  const scoresRef = React.createRef<HTMLDivElement>();
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
                  <Link to={`/users/${s.playerName}`}>{s.playerName}</Link>
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
      <hr />
      {/* {renderScoresPart(round.playerScores, username, 0, 8, true)}
      {renderScoresPart(round.playerScores, username, 8, 18, false)}
      {renderScoresPart(round.playerScores, username, 19, 30, false)} */}

      <div
        ref={scoresRef}
        style={{
          backgroundColor: colors.background,
        }}
      >
        <div className="is-size-6 mb-0 ml-2 is-pulled-left">
          {round.courseName}&nbsp;-&nbsp;
          {new Date(round.startTime).toISOString().substring(0, 10)}&nbsp;
        </div>
        <div>{renderScoresThight(round.playerScores, username)}</div>
        <div className="is-size-7 is-italic">
          discman.live&nbsp;-&nbsp;{new Date().getFullYear()}
        </div>
      </div>
      <br />

      <button
        disabled={cannotShare}
        className="button mt-3"
        style={{ backgroundColor: colors.button }}
        onClick={() => {
          setShowThight(true);
          if (!scoresRef.current) return;
          toBlob(scoresRef.current)
            .then((blob) => {
              if (!blob) return;
              const file = new File([blob], "roundsummary.png", {
                type: blob.type,
              });
              Object.freeze(file);

              navigator.share({
                files: [file],
              } as any);
            })
            .catch(() => setCannotShare(true))
            .finally(() => setShowThight(false));
        }}
      >
        {cannotShare ? "Share not supported" : "Share"}
      </button>
    </>
  );
};
