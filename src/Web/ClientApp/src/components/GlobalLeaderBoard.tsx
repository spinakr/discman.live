import * as React from "react";
import { connect, ConnectedProps } from "react-redux";
import { ApplicationState } from "../store";
import { actionCreators as leaderboardActionCreators } from "../store/Leaderboard";
import { useEffect } from "react";

const mapState = (state: ApplicationState) => {
  return {
    user: state.user,
    leaderboard: state.leaderboard,
  };
};

const connector = connect(mapState, leaderboardActionCreators);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {};

const GlobalLeaderBoard = (props: Props) => {
  const { fetchLeaderboard } = props;
  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);
  return (
    <div className="section">
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
                <td>{p.username}</td>
                <td>{p.averageHoleScore.toFixed(1)}</td>
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
