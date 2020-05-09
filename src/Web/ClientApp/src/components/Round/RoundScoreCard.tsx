import React, { useEffect } from "react";
import { Round } from "../../store/Rounds";

export interface ScoreCardProps {
  username: string;
  round: Round;
  activeHole: number;
  setActiveHole: (hole: number) => void;
}

const RoundScoreCard = ({
  username,
  round,
  activeHole,
  setActiveHole,
}: ScoreCardProps) => {
  const tableRef = React.createRef<HTMLDivElement>();
  useEffect(() => {
    if (tableRef.current) {
      if (activeHole > 5) tableRef.current.scrollLeft = 200;
      if (activeHole > 10) tableRef.current.scrollLeft = 400;
      if (activeHole > 15) tableRef.current.scrollLeft = 600;
    }
  });
  return (
    <div className="table-container tour-scorecard" ref={tableRef}>
      <table className="table">
        <thead>
          <tr>
            <th className="tour-score-edit">
              Hole
              <br />
              Par
            </th>
            {round.playerScores[0].scores.map((s) => (
              <th
                key={s.hole.number}
                onClick={() => setActiveHole(s.hole.number)}
                className={s.hole.number === activeHole ? "is-selected" : ""}
              >
                {s.hole.number} <br />
                <i>{s.hole.par}</i>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {round.playerScores.map((playerScore) => (
            <tr
              key={playerScore.playerName}
              className={
                playerScore.playerName === username
                  ? "has-background-grey-lighter"
                  : ""
              }
            >
              <td>
                {playerScore.playerName}&nbsp;(
                {playerScore.scores.reduce((total, score) => {
                  return total + score.relativeToPar;
                }, 0)}
                )
              </td>
              {playerScore.scores.map((s) => (
                <td
                  className={s.hole.number === activeHole ? "is-selected" : ""}
                  key={s.hole.number}
                >
                  {s.strokes}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RoundScoreCard;
