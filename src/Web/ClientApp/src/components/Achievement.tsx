import * as React from "react";
import { UserAchievement } from "../store/User";
import { Link } from "react-router-dom";

export interface AchievementsProps {
  achievement: UserAchievement;
  count?: number;
}
export default ({ achievement, count }: AchievementsProps) => (
  <div className="box" style={{ maxWidth: "350px", padding: "10px" }}>
    <Link to={`/rounds/${achievement.roundId}`}>
      <article className="media">
        <div className="media-left">
          <figure className="image is-64x64">
            <img
              src="https://bulma.io/images/placeholders/128x128.png"
              alt="BogeyFreeRound"
            />
          </figure>
        </div>
        <div className="media-content">
          <div className="content">
            <p>
              <strong>{achievement.username}</strong> &nbsp;
              <small>
                {new Date(achievement.achievedAt).toLocaleDateString()}
              </small>
              <br />
              <b>{achievement.achievementName}</b> {count && `(${count})`}
            </p>
          </div>
        </div>
      </article>
    </Link>
  </div>
);
