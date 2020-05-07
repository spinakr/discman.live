import React from "react";
import { Round, HoleScore } from "../../store/Rounds";

export interface RoundSummaryProps {
  round: Round;
}

const playerTotal = (round: Round, player: string) => {
  return round.scores.reduce((total, hole) => {
    const ascore = hole.scores.find((s) => s.player === player);
    if (!ascore) return 0;
    return total + ascore.relativeToPar;
  }, 0);
};

export default ({ round }: RoundSummaryProps) => {
  round.players.sort((a, b) => {
    const atotal = playerTotal(round, a);
    const btotal = playerTotal(round, b);
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

  const renderPlayerHoleScore = (s: HoleScore, player: string) => {
    const mark = s.scores.find((s) => s.player === player)?.relativeToPar || 0;
    const strokes = s.scores.find((s) => s.player === player)?.strokes || 0;
    return (
      <td className={scoreColorStyle(mark)} key={s.hole.number}>
        {strokes}
      </td>
    );
  };

  return (
    <div className="table-container tour-scorecard">
      <table className="table">
        <thead>
          <tr>
            <th>
              Hole
              <br />
              Par
            </th>
            {round.scores.map((s) => (
              <th key={s.hole.number}>
                {s.hole.number} <br />
                <i>{s.hole.par}</i>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {round.players.map((p) => (
            <tr key={p}>
              <td>
                {p}&nbsp;(
                {playerTotal(round, p)})
              </td>
              {round.scores.map((s) => renderPlayerHoleScore(s, p))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
