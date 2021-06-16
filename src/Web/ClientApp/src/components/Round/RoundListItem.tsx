import React from "react";
import { Round } from "../../store/Rounds";
import { Link } from "react-router-dom";

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
    <Link className={style} key={round.id} to={`/rounds/${round.id}`}>
      <span className="panel-icon">
        <i
          className={`fas ${round.isCompleted ? "fa-check" : "fa-spinner"}`}
        ></i>
      </span>
      {round.courseName || round.roundName} -{" "}
      <i>
        {new Date(round.startTime).toISOString().substring(0, 10)}
        {round.isCompleted
          ? ` | ${userTotal > 0 ? "+" : ""}${userTotal}`
          : ""}{" "}
      </i>
    </Link>
  );
};

export default RoundListItem;
