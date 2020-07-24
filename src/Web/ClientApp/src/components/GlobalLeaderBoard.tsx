/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from "react";
import { connect, ConnectedProps } from "react-redux";
import { ApplicationState } from "../store";
import { actionCreators as leaderboardActionCreators } from "../store/Leaderboard";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import InformationDialogue from "./InformationDialogue";

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

const GlobalLeaderBoard = (props: Props) => {
  const [activeMonth, setActiveMonth] = useState(new Date().getMonth() + 1);
  const { fetchLeaderboard } = props;
  const [onlyFriends, setOnlyFriends] = useState(true);
  useEffect(() => {
    fetchLeaderboard(onlyFriends, activeMonth);
  }, [activeMonth, fetchLeaderboard, onlyFriends]);
  return (
    <>
      <div className="tabs is-centered">
        <ul>
          <li
            className={onlyFriends ? "is-active" : ""}
            onClick={() => setOnlyFriends(true)}
          >
            <a>Friends</a>
          </li>
          <li
            className={!onlyFriends ? "is-active" : ""}
            onClick={() => setOnlyFriends(false)}
          >
            <a>Global</a>
          </li>
        </ul>
      </div>

      <div className="container">
        <div className="field is-grouped">
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
          <InformationDialogue
            title="Leaderboard"
            text="Leader board is calculated based on average score adjusted against the difficulty of the course played. Playing only easy courses will not take you to the top of the leader board."
          />
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
                    {p.courseAdjustedAverageScore < 0 ? "" : "+"}
                    {p.courseAdjustedAverageScore.toFixed(1)}
                  </td>
                  <td>{p.roundCount}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default connector(GlobalLeaderBoard);
