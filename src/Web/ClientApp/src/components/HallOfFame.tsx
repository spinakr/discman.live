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

const HallOfFame = (props: Props) => {
  const { fetchHallOfFame } = props;
  useEffect(() => {
    fetchHallOfFame();
  }, [fetchHallOfFame]);
  const hallOfFame = props.leaderboard?.hallOfFame;
  if (!props.leaderboard?.hallOfFame?.mostBirdies?.username) return null;
  return (
    <div className="">
      <div className="columns is-mobile">
        <div className="column is-4"></div>
        <div className="column is-half">
          <h5 className="title is-5">Hall of Fame </h5>
        </div>
        <div
          className="column is-4 has-tooltip has-tooltip-left has-tooltip-multiline"
          data-tooltip="Hall of Fame is updated at end of each month. Only rounds with at least 2 players count. Only players with at least 5 rounds can win."
        >
          <span className="icon is-large icon has-text-info is-inline-block">
            <i className="fas fa-lg fa-info"></i>
          </span>
        </div>
      </div>

      <table className="table is-fullwidth is-narrow is-striped">
        <tr>
          <th>Price</th>
          <th>Player</th>
          <th>Score</th>
          <th
            data-tooltip="Number of days in Hall Of Fame"
            className="has-tooltip has-tooltip-left has-multiline-tooltip"
          >
            Days
          </th>
        </tr>
        <tr>
          <td>
            Birdies{" "}
            {hallOfFame?.mostBirdies.newThisMonth && (
              <span className="tag is-info is-light">New</span>
            )}
          </td>
          <td>{hallOfFame?.mostBirdies.username}</td>
          <td>
            {hallOfFame?.mostBirdies.count}({hallOfFame?.mostBirdies.perRound}
            /r)
          </td>
          <td>{hallOfFame?.mostBirdies.daysInHallOfFame}</td>
        </tr>
        <tr>
          <td>
            Bogies
            {hallOfFame?.mostBogies.newThisMonth && (
              <span className="tag is-info is-light">New</span>
            )}
          </td>
          <td>{hallOfFame?.mostBogies.username}</td>
          <td>
            {hallOfFame?.mostBogies.count} ({hallOfFame?.mostBogies.perRound}/r)
          </td>
          <td>{hallOfFame?.mostBogies.daysInHallOfFame}</td>
        </tr>
        <tr>
          <td>
            Rounds
            {hallOfFame?.mostRounds.newThisMonth && (
              <span className="tag is-info is-light">New</span>
            )}
          </td>
          <td>{hallOfFame?.mostRounds.username}</td>
          <td>{hallOfFame?.mostRounds.count}</td>
          <td>{hallOfFame?.mostRounds.daysInHallOfFame}</td>
        </tr>
        <tr>
          <td>
            Avg. score
            {hallOfFame?.bestRoundAverage.newThisMonth && (
              <span className="tag is-info is-light">New</span>
            )}
          </td>
          <td>{hallOfFame?.bestRoundAverage.username}</td>
          <td>{hallOfFame?.bestRoundAverage.roundAverage}</td>
          <td>{hallOfFame?.bestRoundAverage.daysInHallOfFame}</td>
        </tr>
      </table>
      <hr />
    </div>
  );
};

export default connector(HallOfFame);
