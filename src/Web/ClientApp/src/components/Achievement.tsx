import * as React from "react";
import { UserAchievement } from "../store/User";
import { Link } from "react-router-dom";

export interface AchievementsProps {
  achievement: UserAchievement;
  count?: number;
}

const imageUrls: any = {
  UnderPar: "paulmcb.jpg",
  StarFrame: "starframe.jpg",
  BogeyRound: "fish.jpg",
  TenUnderPar: "paulmcb10.jpg",
  Turkey: "turkey.jpg",
  ACE: "ace.jpg",
  TenRoundsInAMonth: "month.jpg",
};

const getImage = (achievement: string) => {
  if (!Object.keys(imageUrls).some((x) => x === achievement)) {
    return "https://bulma.io/images/placeholders/128x128.png";
  }
  return imageUrls[achievement];
};

export default ({ achievement, count }: AchievementsProps) => (
  <div className="box" style={{ maxWidth: "350px", padding: "10px" }}>
    <Link to={`/rounds/${achievement.roundId}`}>
      <article className="media">
        <div className="media-left">
          <figure className="image is-64x64">
            <img
              src={getImage(achievement.achievementName)}
              alt={achievement.achievementName}
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
              <b>{achievement.achievementName}</b>
            </p>
          </div>
        </div>
      </article>
    </Link>
  </div>
);
