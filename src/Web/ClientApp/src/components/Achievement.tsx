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
  TenUnderPar: "paulmcb10.jpg",
  Turkey: "turkey.jpg",
  ACE: "ace.jpg",
  TenRoundsInAMonth: "tenmonth.jpg",
  TwentyRoundsInAMonth: "20month.jpg",
  BogeyFreeRound: "nobogey.jpg",
  FiveUnderPar: "paulmcb5.jpg",
  FiveBirdieRound: "5birdie.png",
  // AllPar: "",
  // OnePutPerHole: "",
  // Eagle: "",
  // PlayEveryDayInAWeek: "",
  // OneHundredRounds: "",
  // FiveRoundsInADay: "",
};

const getImage = (achievement: string) => {
  if (!Object.keys(imageUrls).some((x) => x === achievement)) {
    return "https://bulma.io/images/placeholders/128x128.png";
  }
  return imageUrls[achievement];
};

export default ({ achievement, count }: AchievementsProps) => (
  <div className="box" style={{ maxWidth: "350px", padding: "10px" }}>
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
