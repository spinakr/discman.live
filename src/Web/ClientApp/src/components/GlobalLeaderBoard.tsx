import * as React from "react";
import { connect, ConnectedProps } from "react-redux";
import { ApplicationState } from "../store";
import { actionCreators as leaderboardActionCreators } from "../store/Leaderboard";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UserStats from "./User/UserStats";

const mapState = (state: ApplicationState) => {
  return {
    user: state.user,
    leaderboard: state.leaderboard,
  };
};

const connector = connect(mapState, leaderboardActionCreators);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {};

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const getYearMonthString = (date: Date) =>
  `${months[date.getMonth()]} ${date.getFullYear()}`;

const GlobalLeaderBoard = (props: Props) => {
  const { fetchLeaderboard } = props;
  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);
  const [activeYearMonth, setActiveYearMonth] = useState(
    getYearMonthString(new Date())
  );
  return (
    <div className="section">
      <h5 className="title is-5 has-text-centered">{activeYearMonth} </h5>
      <table className="table is-fullwidth ">
        <thead>
          <tr>
            <td>#</td>
            <td>Player</td>
            <td>Avg</td>
            <td>Rounds</td>
          </tr>
        </thead>
        <tbody>
          {props.leaderboard?.players.map((p, i) => {
            return (
              <tr>
                <td>{i + 1}</td>
                <td>
                  <Link to={`users/${p.username}`}>{p.username}</Link>
                </td>
                <td>
                  {p.averageHoleScore < 0 ? "" : "+"}
                  {p.averageHoleScore.toFixed(1)}
                </td>
                <td>{p.roundCount}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default connector(GlobalLeaderBoard);
