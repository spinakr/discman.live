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

const getYearMonthString = (month: number) =>
  `${months[month - 1]} ${new Date().getFullYear()}`;

const GlobalLeaderBoard = (props: Props) => {
  const [activeMonth, setActiveMonth] = useState(new Date().getMonth() + 1);
  const { fetchLeaderboard } = props;
  useEffect(() => {
    fetchLeaderboard(activeMonth);
  }, [activeMonth, fetchLeaderboard]);
  return (
    <div className="section">
      <div className="field">
        <div className="control has-icons-left">
          <div className="select is-medium">
            <select
              value={activeMonth}
              onChange={(e) => setActiveMonth(+e.target.value)}
            >
              {months.map((m, i) => (
                <option key={m} value={i + 1}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div className="icon is-small is-left">
            <i className="fas fa-calendar-alt"></i>
          </div>
        </div>
      </div>
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
              <tr key={i}>
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
