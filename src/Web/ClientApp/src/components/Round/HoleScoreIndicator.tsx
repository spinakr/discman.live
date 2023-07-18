import React from "react";
import { scoreColorStyle } from "../../colors";
import { HoleScore } from "../../store/Rounds";

export default ({
  holeScore,
  tight,
}: {
  holeScore: HoleScore | undefined;
  tight?: boolean;
}) => {
  return holeScore ? (
    <span
      className={`${tight ? "" : "p-1"} ${scoreColorStyle(
        holeScore.relativeToPar,
        holeScore?.strokeSpecs
      )}`}
      style={
        tight
          ? {
              padding: "0.035rem",
              paddingRight: "0.140rem",
              paddingLeft: "0.140rem",
            }
          : {}
      }
    >
      {holeScore.strokes === 0 ? "-" : holeScore.strokes}
    </span>
  ) : null;
};
