import React, { useEffect } from "react";
import colors from "../../colors";
import { Round, PlayerCourseStats } from "../../store/Rounds";

export interface ScoreCardProps {
  username: string;
  round: Round;
  activeHole: number;
  setActiveHole: (hole: number) => void;
  playersStats: PlayerCourseStats[];
  closeDialog: () => void;
}

const RoundScoreCard = ({
  username,
  round,
  activeHole,
  setActiveHole,
  closeDialog,
  playersStats,
}: ScoreCardProps) => {
  const tableRef = React.createRef<HTMLDivElement>();
  useEffect(() => {
    if (tableRef.current) {
      if (activeHole > 5) tableRef.current.scrollLeft = 200;
      if (activeHole > 10) tableRef.current.scrollLeft = 400;
      if (activeHole > 15) tableRef.current.scrollLeft = 600;
    }
  });
  const playerStats = playersStats.find((s) => s.playerName === username);

  return (
    <div className="columns is-marginless is-paddingless is-mobile">
      <div className="column is-narrow is-marginless is-paddingless">
        <table
          className="table is-marginless is-paddingless is-bordered"
          style={{ backgroundColor: colors.table }}
        >
          <thead>
            <tr>
              <th>Hole</th>
            </tr>
            <tr className="lower-row">
              <td>
                <i className="is-size-7">Par</i>
              </td>
            </tr>
            <tr className="lower-row">
              <td>
                <i className="is-size-7">Distance</i>
              </td>
            </tr>
            <tr className="lower-row">
              <td>
                <i className="is-size-7">Average</i>
              </td>
            </tr>
            <tr className="lower-row">
              <td>
                <i className="is-size-7">Rating</i>
              </td>
            </tr>
          </thead>
          <tbody>
            {round.playerScores
              .map((p) => {
                return {
                  name: p.playerName,
                  totalScore: p.scores.reduce((total, score) => {
                    return total + score.relativeToPar;
                  }, 0),
                };
              })
              .sort((a, b) => a.totalScore - b.totalScore)
              .map((s) => (
                <tr key={s.totalScore}>
                  <td key={s.name}>
                    {s.name}&nbsp;(
                    {s.totalScore} )
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div
        className="column table-container is-marginless is-paddingless"
        ref={tableRef}
      >
        <table
          className="table is-bordered"
          style={{ backgroundColor: colors.table }}
        >
          <thead>
            <tr>
              {round.playerScores[0].scores.map((s) => (
                <th
                  key={s.hole.number}
                  onClick={() => {
                    setActiveHole(s.hole.number);
                    closeDialog();
                  }}
                  style={{ whiteSpace: "nowrap" }}
                  className={
                    s.hole.number === activeHole ? "is-selected pr-0" : "pr-0"
                  }
                >
                  {s.hole.number}
                  {playerStats &&
                    playerStats.holeStats.find(
                      (h) => h.holeNumber === s.hole.number
                    )?.birdie && (
                      <span className="icon is-small">
                        <i className="fas fa-dove"></i>
                      </span>
                    )}
                </th>
              ))}
            </tr>
            <tr className="lower-row">
              {round.playerScores[0].scores.map((s) => (
                <td
                  key={s.hole.number}
                  onClick={() => {
                    setActiveHole(s.hole.number);
                    closeDialog();
                  }}
                  className={s.hole.number === activeHole ? "is-selected" : ""}
                >
                  <i className="is-size-7">{s.hole.par}</i>
                </td>
              ))}
            </tr>
            <tr className="lower-row">
              {round.playerScores[0].scores.map((s) => (
                <td
                  key={s.hole.number}
                  onClick={() => {
                    setActiveHole(s.hole.number);
                    closeDialog();
                  }}
                  className={s.hole.number === activeHole ? "is-selected" : ""}
                >
                  <i className="is-size-7">{s.hole.distance}</i>
                </td>
              ))}
            </tr>
            <tr className="lower-row">
              {round.playerScores[0].scores.map((s) => (
                <td
                  key={s.hole.number}
                  onClick={() => {
                    setActiveHole(s.hole.number);
                    closeDialog();
                  }}
                  className={s.hole.number === activeHole ? "is-selected" : ""}
                >
                  <i className="is-size-7">{s.hole.average.toFixed(1)}</i>
                </td>
              ))}
            </tr>
            <tr className="lower-row">
              {round.playerScores[0].scores.map((s) => (
                <td
                  key={s.hole.number}
                  onClick={() => {
                    setActiveHole(s.hole.number);
                    closeDialog();
                  }}
                  className={s.hole.number === activeHole ? "is-selected" : ""}
                >
                  <i className="is-size-7">{s.hole.rating}</i>
                </td>
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
