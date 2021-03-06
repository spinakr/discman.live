import * as React from "react";
import { Round } from "../../store/Rounds";
import { UserAchievement } from "../../store/User";
import Achievement from "../Achievement";

export interface RoundAchievementsProps {
  round: Round;
  swipeHandlers: any;
}

export default ({ round, swipeHandlers }: RoundAchievementsProps) => {
  return (
    <div className="columns is-centered" {...swipeHandlers}>
      <div className="column is-one-third">
        {round.achievements &&
          round.achievements.map((a: UserAchievement) => (
            <div key={`${a.achievementName}${a.username}`} className="column">
              <Achievement achievement={a} />
            </div>
          ))}
      </div>
    </div>
  );
};
