import React, { useEffect } from "react";
import colors, { scoreColorStyle } from "../../colors";
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
      if (activeHole > 4) tableRef.current.scrollLeft = 200;
      if (activeHole > 9) tableRef.current.scrollLeft = 400;
      if (activeHole > 14) tableRef.current.scrollLeft = 600;
    }
  });
  const playerStats = playersStats.find((s) => s.playerName === username);

  const sortedPlayerScores = round.playerScores
    .map((p) => {
      return {
        name: p.playerName,
        scores: p.scores,
        totalScore: p.scores.reduce((total, score) => {
          return total + score.relativeToPar;
        }, 0),
      };
    })
    .sort((a, b) => a.totalScore - b.totalScore);

  return (
    <div className="columns is-marginless is-paddingless is-mobile">
      <div className="column is-narrow is-marginless is-paddingless">
        <table
          className="table is-marginless is-paddingless mb-2"
          style={{ backgroundColor: colors.table }}
        >
          <tbody>
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
                <i className="is-size-7">Average</i>
              </td>
            </tr>
            <tr className="lower-row score-card-divider-row">
              <td>
                <i className="is-size-7">Rating</i>
              </td>
            </tr>
            {sortedPlayerScores.map((s) => (
              <tr
                key={s.name}
                className={s.name === username ? "active-user-row" : ""}
              >
                <td>
                  {s.name}&nbsp;(
                  {s.totalScore})
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
        <table className="table mb-2" style={{ backgroundColor: colors.table }}>
          <tbody>
            <tr>
              {round.playerScores[0].scores.map((s, holeIndex) => (
                <th
                  key={s.hole.number}
                  onClick={() => {
                    setActiveHole(holeIndex);
                    closeDialog();
                  }}
                  style={{ whiteSpace: "nowrap" }}
                  className={
                    holeIndex === activeHole ? "is-selected pr-0" : "pr-0"
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
              {round.playerScores[0].scores.map((s, holeIndex) => (
                <td
                  key={s.hole.number}
                  onClick={() => {
                    setActiveHole(holeIndex);
                    closeDialog();
                  }}
                  className={holeIndex === activeHole ? "is-selected" : ""}
                >
                  <i className="is-size-7">{s.hole.par}</i>
                </td>
              ))}
            </tr>
            <tr className="lower-row">
              {round.playerScores[0].scores.map((s, holeIndex) => (
                <td
                  key={s.hole.number}
                  onClick={() => {
                    setActiveHole(holeIndex);
                    closeDialog();
                  }}
                  className={holeIndex === activeHole ? "is-selected" : ""}
                >
                  <i className="is-size-7">{s.hole.average.toFixed(1)}</i>
                </td>
              ))}
            </tr>
            <tr className="lower-row score-card-divider-row">
              {round.playerScores[0].scores.map((s, holeIndex) => (
                <td
                  key={s.hole.number}
                  onClick={() => {
                    setActiveHole(holeIndex);
                    closeDialog();
                  }}
                  className={holeIndex === activeHole ? "is-selected" : ""}
                >
                  <i className="is-size-7">{s.hole.rating}</i>
                </td>
              ))}
            </tr>
            {sortedPlayerScores.map((playerScore) => (
              <tr
                key={playerScore.name}
                className={
                  playerScore.name === username ? "active-user-row" : ""
                }
              >
                {playerScore.scores.map((s, holeIndex) => (
                  <td
                    className={`${scoreColorStyle(
                      s.relativeToPar,
                      s.strokeSpecs
                    )} ${holeIndex === activeHole ? "is-selected" : ""}`}
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
