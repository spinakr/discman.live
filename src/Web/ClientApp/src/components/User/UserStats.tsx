import React, { useEffect, useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { ApplicationState } from "../../store";
import * as UserStore from "../../store/User";

const mapState = (state: ApplicationState) => {
  return {
    user: state.user,
  };
};

const connector = connect(mapState, UserStore.actionCreators);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {};

const UserStatsComponent = (props: Props) => {
  const [statsSince, setStatsSince] = useState(0);
  const { fetchUserStats, user } = props;
  useEffect(() => {
    fetchUserStats(statsSince);
  }, [fetchUserStats, statsSince]);
  const userStats = user?.userStats;

  return (
    <>
      <div className="columns is-mobile">
        <div className="column is-half"></div>
        <div className="column is-half">
          <div className="field">
            <div className="control">
              <div className="select is-primary">
                <select
                  value={statsSince}
                  onChange={(e) => {
                    setStatsSince(+e.target.value);
                  }}
                >
                  <option value="1">Last month</option>
                  <option value="3">Last 3 months</option>
                  <option value={new Date().getMonth() + 1}>
                    Year to date
                  </option>
                  <option value="0">All time</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        {userStats && (
          <div className="">
            <div className="columns is-centered is-mobile">
              <div className="column has-text-centered">
                <h6 className="title is-6">Rounds played</h6>
                {userStats.roundsPlayed}
              </div>
              <div className="column has-text-centered">
                <h6 className="title is-6">Holes played</h6>
                {userStats.holesPlayed}
              </div>
            </div>
            <div className="columns is-centered is-mobile">
              <div className="column has-text-centered">
                <h6 className="title is-6">Fairway hit rate</h6>
                {(userStats.fairwayHitRate * 100).toFixed(0)} %
              </div>
              <div className="column has-text-centered">
                <h6 className="title is-6">Scramble rate</h6>
                {(userStats.scrambleRate * 100).toFixed(0)} %
              </div>
            </div>
            <div className="columns is-centered is-mobile">
              <div className="column has-text-centered">
                <h6 className="title is-6">Puts/hole</h6>
                {userStats.putsPerHole.toFixed(1)}
              </div>
              <div className="column has-text-centered">
                <h6 className="title is-6">One-put rate</h6>
                {(userStats.onePutRate * 100).toFixed(0)} %
              </div>
            </div>
            <div className="columns is-centered is-mobile">
              <div className="column has-text-centered">
                <h6 className="title is-6">Total score</h6>
                {`${userStats.totalScore < 0 ? "-" : "+"}${Math.abs(
                  userStats.totalScore
                )}`}
              </div>
              <div className="column has-text-centered">
                <h6 className="title is-6">Strokes gained</h6>
                {userStats.strokesGained.toFixed(1)}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default connector(UserStatsComponent);
