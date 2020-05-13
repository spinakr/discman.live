import React, { useEffect } from "react";
import { Round } from "../../store/Rounds";

export interface ScoreCardProps {
  username: string;
  round: Round;
  activeHole: number;
  setActiveHole: (hole: number) => void;
  closeDialog: () => void;
}

const RoundScoreCard = ({
  username,
  round,
  activeHole,
  setActiveHole,
  closeDialog,
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
    <div className="columns is-marginless is-paddingless is-mobile">
      <div className="column is-narrow is-marginless is-paddingless">
        <table className="table is-marginless is-paddingless is-narrow is-bordered">
          <thead>
            <tr>
              <th>
                Hole <br />
                Par <br />
                Distance <br />
              </th>
            </tr>
          </thead>
          <tbody>
            {round.playerScores.map((s) => (
              <tr key={s.playerName}>
                <td>
                  {s.playerName}&nbsp;(
                  {s.scores.reduce((total, score) => {
                    return total + score.relativeToPar;
                  }, 0)}
                  )
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div
        className="column table-container tour-scorecard is-marginless is-paddingless"
        ref={tableRef}
      >
        <table className="table is-bordered is-narrow">
          <thead>
            <tr>
              {round.playerScores[0].scores.map((s) => (
                <th
                  key={s.hole.number}
                  onClick={() => {
                    setActiveHole(s.hole.number);
                    closeDialog();
                  }}
                  className={s.hole.number === activeHole ? "is-selected" : ""}
                >
                  {s.hole.number} <br />
                  {s.hole.par} <br />
                  {s.hole.distance} <br />
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
                {playerScore.scores.map((s) => (
                  <td
                    className={
                      s.hole.number === activeHole ? "is-selected" : ""
                    }
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
    </div>
  );
};

export default RoundScoreCard;
