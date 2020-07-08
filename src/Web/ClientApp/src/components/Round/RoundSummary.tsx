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
import PlayerCourseImprovments from "./PlayerCourseImprovments";
import RoundAchievements from "./RoundAchievements";

export interface RoundSummaryProps {
  round: Round;
}

const playerTotal = (playerScore: PlayerScore) => {
  return playerScore.scores.reduce((total, hole) => {
    return total + hole.relativeToPar;
  }, 0);
};

export default ({ round }: RoundSummaryProps) => {
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

  const renderScores = (
    playerScores: PlayerScore[],
    from: number,
    to: number,
    withTotals: boolean
  ) => {
    return (
      <table className="table is-narrow">
        <thead>
          <tr>
            {withTotals && (
              <th>
                Hole
                <br />
                Par
              </th>
            )}
            {playerScores[0].scores.slice(from, to).map((s) => (
              <th key={s.hole.number}>
                {s.hole.number} <br />
                <i>{s.hole.par}</i>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {playerScores.map((p) => (
            <tr key={p.playerName}>
              {withTotals && (
                <td>
                  {p.playerName}&nbsp;(
                  {playerTotal(p)})
                </td>
              )}
              {p.scores.slice(from, to).map((s) => renderPlayerHoleScore(s))}
            </tr>
          ))}
        </tbody>
      </table>
    );
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
            <a>Scores</a>
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
            <a>Chart</a>
          </li>

          <li
            className={active === 4 ? "is-active" : ""}
            onClick={() => setActive(4)}
          >
            <a>Achievements</a>
          </li>
        </ul>
      </div>

      {active === 1 && (
        <div>
          <div
            className="table-container"
            style={{ paddingTop: "0px", marginTop: "0px", paddingLeft: "15px" }}
          >
            {renderScores(round.playerScores, 0, 8, true)}
            {renderScores(round.playerScores, 8, 18, false)}
            {renderScores(round.playerScores, 19, 30, false)}
            <hr />
            <PlayerCourseImprovments />
          </div>
          <div style={{ height: "300px", width: "auto" }} {...handlers}></div>
        </div>
      )}
      {active === 2 && <RoundPrices round={round} swipeHandlers={handlers} />}

      {active === 3 && <RoundChart round={round} swipeHandlers={handlers} />}

      {active === 4 && (
        <RoundAchievements round={round} swipeHandlers={handlers} />
      )}
    </div>
  );
};
