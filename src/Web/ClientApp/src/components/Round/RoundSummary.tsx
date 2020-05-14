/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { useSwipeable } from "react-swipeable";
import {
  Round,
  HoleScore,
  PlayerScore,
  PlayerCourseStats,
} from "../../store/Rounds";
import RoundChart from "./RoundChart";
import RoundPrices from "./RoundPrices";

export interface RoundSummaryProps {
  round: Round;
  playersCourseStats: PlayerCourseStats[];
}

const playerTotal = (playerScore: PlayerScore) => {
  return playerScore.scores.reduce((total, hole) => {
    return total + hole.relativeToPar;
  }, 0);
};

export default ({ round, playersCourseStats }: RoundSummaryProps) => {
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

  const [active, setActive] = useState(1);

  const config = {};
  const handlers = useSwipeable({
    onSwiped: (eventData) => {
      if (eventData.dir === "Left") {
        if (active === 3) return;
        setActive(active + 1);
      }
      if (eventData.dir === "Right") {
        if (active === 1) return;
        setActive(active - 1);
      }
    },
    ...config,
  });

  return (
    <div>
      <div className="tabs is-centered">
        <ul>
          <li
            className={active === 1 ? "is-active" : ""}
            onClick={() => setActive(1)}
          >
            <a>Scorecard</a>
          </li>
          <li
            className={active === 2 ? "is-active" : ""}
            onClick={() => setActive(2)}
          >
            <a>Prices</a>
          </li>
          <li
            className={active === 3 ? "is-active" : ""}
            onClick={() => setActive(3)}
          >
            <a>Roundchart</a>
          </li>
        </ul>
      </div>

      {active === 1 && (
        <div>
          <div className="table-container section">
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
            <hr />
            <h2 className="subtitle">Self-development </h2>
            <table className="table">
              <thead>
                <tr>
                  <th>Player</th>
                  <th
                    className="has-tooltip-info"
                    data-tooltip={`Player average score on ${round.courseName} \n over the last 5 rounds`}
                  >
                    Avg.
                  </th>
                  <th
                    className="has-tooltip-info"
                    data-tooltip={`Improvement versus personal average \n on ${round.courseName}`}
                  >
                    Impr.
                  </th>
                </tr>
              </thead>
              <tbody>
                {playersCourseStats.map((s) => {
                  const improv = Math.round(s.thisRoundVsAverage);
                  const courseAvg = Math.round(s.courseAverage);
                  return (
                    <tr key={s.playerName}>
                      <td>{s.playerName}</td>
                      <td>
                        {courseAvg > 0 ? "+" : courseAvg < 0 ? " - " : ""}
                        {Math.abs(courseAvg)}
                      </td>
                      <td
                        className={
                          improv > 0
                            ? "has-text-danger"
                            : improv < 0
                            ? "has-text-primary"
                            : ""
                        }
                      >
                        {improv > 0 ? "+" : improv < 0 ? " - " : ""}
                        {Math.abs(improv)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div style={{ height: "300px", width: "auto" }} {...handlers}></div>
        </div>
      )}
      {active === 2 && <RoundPrices round={round} swipeHandlers={handlers} />}

      {active === 3 && <RoundChart round={round} swipeHandlers={handlers} />}
    </div>
  );
};
