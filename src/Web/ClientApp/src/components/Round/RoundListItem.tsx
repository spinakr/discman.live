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

  let style = "panel-block is-link";
  const startTime = new Date(round.startTime);
  const startedAgo = Date.now().valueOf() - startTime.valueOf();
  const startedAgoMins = startedAgo / 1000 / 60;
  if (startedAgoMins < 10) style += " is-active";
  return (
    <a className={style} key={round.id} href={`/rounds/${round.id}`}>
      <span className="panel-icon">
        <i className="fas fa-circle-notch"></i>
      </span>
      {round.courseName || round.roundName} -{" "}
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
