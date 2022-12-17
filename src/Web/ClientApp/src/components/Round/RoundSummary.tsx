import React, { useState } from "react";
import { useSwipeable } from "react-swipeable";
import { Round, PlayerScore } from "../../store/Rounds";
import RoundChart from "./RoundChart";
import RoundStats from "./RoundStats";
import { UserStats } from "../../store/User";
import RoundLeaderboard from "./RoundLeaderboard";
import RoundAchievements from "./RoundAchievements";

export interface RoundSummaryProps {
  round: Round;
  finishedRoundStats: UserStats[];
  username: string;
}

const playerTotal = (playerScore: PlayerScore) => {
  return playerScore.scores.reduce((total, hole) => {
    return total + hole.relativeToPar;
  }, 0);
};

export default ({ round, finishedRoundStats, username }: RoundSummaryProps) => {
  round.playerScores.sort((a, b) => {
    const atotal = playerTotal(a);
    const btotal = playerTotal(b);
    return atotal === btotal ? 0 : atotal < btotal ? -1 : 1;
  });

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
    <div className="container has-text-centered" style={{ paddingBottom: 50 }}>
      <div className="tabs my-0 is-centered">
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
            <a>Stats</a>
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

      {active === 1 && <RoundLeaderboard round={round} username={username} />}
      {active === 2 && (
        <RoundStats
          stats={finishedRoundStats}
          swipeHandlers={handlers}
          username={username}
        />
      )}

      {active === 3 && <RoundChart round={round} swipeHandlers={handlers} />}
      {active === 4 && (
        <RoundAchievements round={round} swipeHandlers={handlers} />
      )}
    </div>
  );
};
