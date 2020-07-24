import * as React from "react";
import { connect, ConnectedProps } from "react-redux";
import { ApplicationState } from "../store";
import { actionCreators as leaderboardActionCreators } from "../store/Leaderboard";
import { useEffect } from "react";
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

const HallOfFame = (props: Props) => {
  const { fetchHallOfFame } = props;
  useEffect(() => {
    fetchHallOfFame();
  }, [fetchHallOfFame]);
  const currentHallOfFame = props.leaderboard?.hallOfFame;
  if (!props.leaderboard?.hallOfFame?.mostBirdies?.username) return null;
  return (
    <div className="">
      <div className="columns is-mobile">
        <div className="column is-4"></div>
        <div className="column is-half">
          <h5 className="title is-5">Hall of Fame </h5>
        </div>
        <InformationDialogue
          title="Hall of Fame"
          text="Hall of Fame is updated at end of each month. Only rounds with at least 2 players count. Only players with at least 5 rounds can win."
        />
      </div>

      <table className="table is-fullwidth is-narrow is-striped">
        <thead>
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
        </thead>
        <tbody>
          <tr>
            <td>
              Birdies{" "}
              {currentHallOfFame?.mostBirdies.newThisMonth && (
                <span className="tag is-info is-light">New</span>
              )}
            </td>
            <td>{currentHallOfFame?.mostBirdies.username}</td>
            <td>{currentHallOfFame?.mostBirdies.count}</td>
            <td>{currentHallOfFame?.mostBirdies.daysInHallOfFame}</td>
          </tr>
          <tr>
            <td>
              Bogies
              {currentHallOfFame?.mostBogies.newThisMonth && (
                <span className="tag is-info is-light">New</span>
              )}
            </td>
            <td>{currentHallOfFame?.mostBogies.username}</td>
            <td>{currentHallOfFame?.mostBogies.count}</td>
            <td>{currentHallOfFame?.mostBogies.daysInHallOfFame}</td>
          </tr>
          <tr>
            <td>
              Rounds
              {currentHallOfFame?.mostRounds.newThisMonth && (
                <span className="tag is-info is-light">New</span>
              )}
            </td>
            <td>{currentHallOfFame?.mostRounds.username}</td>
            <td>{currentHallOfFame?.mostRounds.count}</td>
            <td>{currentHallOfFame?.mostRounds.daysInHallOfFame}</td>
          </tr>
          <tr>
            <td>
              Avg. score
              {currentHallOfFame?.bestRoundAverage.newThisMonth && (
                <span className="tag is-info is-light">New</span>
              )}
            </td>
            <td>{currentHallOfFame?.bestRoundAverage.username}</td>
            <td>
              {currentHallOfFame?.bestRoundAverage.roundAverage.toFixed(1)}
            </td>
            <td>{currentHallOfFame?.bestRoundAverage.daysInHallOfFame}</td>
          </tr>
        </tbody>
      </table>
      <hr />
    </div>
  );
};

export default connector(HallOfFame);
