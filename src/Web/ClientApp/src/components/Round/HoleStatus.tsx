import React from "react";
import colors, { scoreColorStyle } from "../../colors";
import { HoleScore, Round } from "../../store/Rounds";

export interface HoleStatusProps {
  holeScores: {
    username: string;
    scores: HoleScore;
  }[];
  gotoNextHole: () => void;
  editHoleScore: (editHole: boolean) => void;
}

const scoreText = (holeScores: HoleScore) => {
  if (holeScores.strokes === 0) return "-";
  if (holeScores.strokes === 1) return "Ace";
  switch (holeScores.relativeToPar) {
    case 0:
      return "Par";
    case -1:
      return "Birdie";
    case -2:
      return "Eagle";
    case 1:
      return "Bogey";
    case 2:
      return "Double Bogey";
    case 3:
      return "Triple Bogey";
    case 4:
      return "Quadruple Bogey";
    default:
      return holeScores.relativeToPar;
  }
};

export default ({
  gotoNextHole,
  editHoleScore,
  holeScores,
}: HoleStatusProps) => {
  const sortedScores = [...holeScores].sort(
    (a, b) => a.scores.strokes - b.scores.strokes
  );
  return (
    <div className="modal is-active">
      <div className="modal-background"></div>
      <div className="modal-card">
        <div
          className="modal-card-body py-2 px-1"
          style={{ backgroundColor: colors.background }}
        >
          <header
            className="modal-card-head"
            style={{ backgroundColor: colors.background }}
          >
            <div className="modal-card-title has-text-centered">
              <h1 className="title is-4">
                Hole {sortedScores[0].scores.hole.number}
              </h1>
              <h2 className="subtitle">Waiting for other players...</h2>
            </div>
          </header>
          <div
            className="modal-card-body"
            style={{ backgroundColor: colors.background }}
          >
            <table
              className="table is-fullwidth has-text-centered"
              style={{ backgroundColor: colors.background }}
            >
              <tbody>
                {sortedScores.map((s) => (
                  <tr key={s.username}>
                    <td>{s.username}</td>
                    <td>
                      <span
                        className={`p-1 ${scoreColorStyle(
                          s.scores.relativeToPar,
                          s.scores.strokeSpecs
                        )}`}
                      >
                        {s.scores.strokes === 0 ? "-" : s.scores.strokes}
                      </span>
                    </td>
                    <td>{scoreText(s.scores)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <footer
            className="modal-card-foot is-flex is-flex-direction-row is-justify-content-space-evenly"
            style={{ backgroundColor: colors.background }}
          >
            <button
              className="button is-flex"
              onClick={() => editHoleScore(true)}
              style={{ backgroundColor: colors.button }}
            >
              Edit
            </button>
            <button
              className="button is-flex"
              onClick={() => gotoNextHole()}
              style={{ backgroundColor: colors.button }}
            >
              Next
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
};
