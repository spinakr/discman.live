import * as React from "react";
import { UserAchievement } from "../store/User";
import { Link } from "react-router-dom";
import colors from "../colors";
import AchievementImage from "./AchievementImage";

export interface AchievementsProps {
  achievement: UserAchievement;
  count?: number;
}

export default ({ achievement, count }: AchievementsProps) => (
  <div
    className="box"
    style={{
      maxWidth: "350px",
      padding: "10px",
      backgroundColor: colors.background,
    }}
  >
    {count && <span className="badge is-top-right is-dark">{count}</span>}
    <Link
      to={
        achievement.roundId !== "00000000-0000-0000-0000-000000000000"
          ? `/rounds/${achievement.roundId}`
          : "#"
      }
    >
      <article className="media">
        <div className="media-left">
          <AchievementImage achievementName={achievement.achievementName} />
        </div>
        <div className="media-content">
          <div className="content">
            <p>
              <strong>{achievement.username}</strong> &nbsp;
              <small>
                {new Date(achievement.achievedAt).toLocaleDateString()}
              </small>
              <br />
              <b>{achievement.achievementName}</b>
            </p>
          </div>
        </div>
      </article>
    </Link>
  </div>
);
