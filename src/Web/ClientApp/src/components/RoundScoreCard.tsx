import React from "react";
import { Round } from "../store/Rounds";

export interface ScoreCardProps {
  round: Round;
  activeHole: number;
  setActiveHole: (hole: number) => void;
}

export default ({ round, activeHole, setActiveHole }: ScoreCardProps) => (
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
        {round.players.map((p, i) => (
          <tr key={p}>
            <td>
              {p}&nbsp;(
              {round.scores.reduce((total, hole) => {
                return total + hole.scores[i].relativeToPar;
              }, 0)}
              )
            </td>
            {round.scores.map((s) => (
              <td
                className={s.hole.number === activeHole ? "is-selected" : ""}
                key={s.hole.number}
              >
                {s.scores[i].strokes}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
