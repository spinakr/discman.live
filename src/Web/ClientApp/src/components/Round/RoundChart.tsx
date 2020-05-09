import React from "react";
import { Chart } from "react-charts";
import { Round } from "../../store/Rounds";

export interface RoundSummaryProps {
  round: Round;
  swipeHandlers: any;
}

export default ({ round, swipeHandlers }: RoundSummaryProps) => {
  const data = round.playerScores.map((p) => {
    let total = 0;
    return {
      label: p.playerName,
      data: [[0, 0]].concat(
        p.scores.map((s) => {
          total += s.relativeToPar;
          return [s.hole.number, total];
        })
      ),
    };
  });

  const axes = React.useMemo(
    () => [
      { primary: true, type: "linear", position: "bottom" },
      { type: "linear", position: "left" },
    ],
    []
  );
  return (
    <div style={{ height: "500px" }} {...swipeHandlers}>
      <div style={{ width: "350px", height: "200px", padding: "10px" }}>
        <Chart data={data} axes={axes} tooltip />
      </div>
    </div>
  );
};
