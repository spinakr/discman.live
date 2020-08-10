import React from "react";
import { Tournament } from "../../store/Tournaments";

export interface TournamentLeaderboardProps {
  tournament: Tournament;
}

export default ({ tournament }: TournamentLeaderboardProps) => (
  <table className="table is-marginless is-paddingless is-bordered">
    <thead>
      <tr>
        <th>Player</th>
        <th>Score</th>
        <th>Progress</th>
      </tr>
    </thead>
    <tbody>
      {tournament &&
        tournament.leaderboard.scores.map((s) => {
          return (
            <tr key={s.name}>
              <td>{s.name}</td>
              <td>{s.totalScore}</td>
              <td>
                {s.coursesPlayed.length} / {tournament.info.courses.length}{" "}
                courses
              </td>
            </tr>
          );
        })}
    </tbody>
  </table>
);
