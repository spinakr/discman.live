import React from "react";
import { Round } from "../../store/Rounds";

export interface UserRoundProps {
  round: Round;
  username: string;
}

const RoundListItem = (props: UserRoundProps) => {
  const { round, username } = props;
  const userTotal =
    round.playerScores
      .find((s) => s.playerName === username)
      ?.scores.reduce((total, score) => {
        return total + score.relativeToPar;
      }, 0) || 0;

  let style = "list-item";
  const startTime = new Date(round.startTime);
  const startedAgo = Date.now().valueOf() - startTime.valueOf();
  const startedAgoMins = startedAgo / 1000 / 60;
  if (startedAgoMins < 10) style += " has-text-primary has-text-weight-bold";
  return (
    <a className={style} key={round.id} href={`/rounds/${round.id}`}>
      {round.courseName} -{" "}
      <i>
        {new Date(round.startTime).toLocaleDateString()}
        {round.isCompleted
          ? ` | ${userTotal > 0 ? "+" : ""}${userTotal}`
          : ""}{" "}
      </i>
    </a>
  );
};

export default RoundListItem;
