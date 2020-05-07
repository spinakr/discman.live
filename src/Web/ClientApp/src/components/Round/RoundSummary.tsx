import React, { useEffect } from "react";
import { Round, HoleScore, PlayerScore } from "../../store/Rounds";

export interface RoundSummaryProps {
  round: Round;
}

const playerTotal = (playerScore: PlayerScore) => {
  return playerScore.scores.reduce((total, hole) => {
    return total + hole.relativeToPar;
  }, 0);
};

const mostBetterThan = (round: Round, f: (h: HoleScore) => boolean) => {
  const ofBetterThan = (score: PlayerScore) => score.scores.filter(f).length;
  const byBetterThan = round.playerScores
    .filter((s) => ofBetterThan(s) > 0)
    .sort((a, b) => {
      return ofBetterThan(a) - ofBetterThan(b);
    });

  return byBetterThan.length > 0 ? byBetterThan[0].playerName : null;
};

export default ({ round }: RoundSummaryProps) => {
  round.playerScores.sort((a, b) => {
    const atotal = playerTotal(a);
    const btotal = playerTotal(b);
    return atotal === btotal ? 0 : atotal < btotal ? -1 : 1;
  });

  const scoreColorStyle = (mark: number) => {
    switch (mark) {
      case 0:
        return "";
      case -1:
      case -2:
      case -3:
        return "has-background-success";
      case 1:
        return "has-background-warning";
      default:
        return "has-background-danger";
    }
  };

  const renderPlayerHoleScore = (s: HoleScore) => {
    return (
      <td className={scoreColorStyle(s.relativeToPar)} key={s.hole.number}>
        {s.strokes}
      </td>
    );
  };

  const mostBirdies = mostBetterThan(round, (s) => s.relativeToPar < 0);
  const mostPars = mostBetterThan(round, (s) => s.relativeToPar === 0);
  const mostBogies = mostBetterThan(round, (s) => s.relativeToPar > 0);

  return (
    <>
      <div className="table-container tour-scorecard">
        <table className="table">
          <thead>
            <tr>
              <th>
                Hole
                <br />
                Par
              </th>
              {round.playerScores[0].scores.map((s) => (
                <th key={s.hole.number}>
                  {s.hole.number} <br />
                  <i>{s.hole.par}</i>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {round.playerScores.map((p) => (
              <tr key={p.playerName}>
                <td>
                  {p.playerName}&nbsp;(
                  {playerTotal(p)})
                </td>
                {p.scores.map((s) => renderPlayerHoleScore(s))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="columns section">
        {mostBirdies && (
          <div className="column">
            <div className="card has-background-success">
              <div className="card-content has-text-centered">
                Most birdies:
                <br />
                <span className="has-text-weight-bold is-size-3">
                  {mostBirdies}
                </span>
              </div>
            </div>
          </div>
        )}
        {mostPars && (
          <div className="column">
            <div className="card">
              <div className="card-content has-text-centered">
                Most pars: <br />
                <span className="has-text-weight-bold is-size-3">
                  {mostPars}
                </span>
              </div>
            </div>
          </div>
        )}
        {mostBogies && (
          <div className="column">
            <div className="card has-background-warning">
              <div className="card-content has-text-centered">
                Most bogies or worse:
                <br />
                <span className="has-text-weight-bold is-size-3">
                  {mostBogies}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
