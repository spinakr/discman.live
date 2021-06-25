import * as React from "react";

export interface AchievementsProps {
  achievementName: string;
  isSmall?: boolean;
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

export default ({ achievementName, isSmall }: AchievementsProps) => (
  <figure className={`image ${isSmall ? "is-24x24" : "is-48x48"}`}>
    <img src={getImage(achievementName)} alt={achievementName} />
  </figure>
);
