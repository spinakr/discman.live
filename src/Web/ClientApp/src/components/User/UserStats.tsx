import React, { useEffect, useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { ApplicationState } from "../../store";
import * as UserStore from "../../store/User";
import { useParams } from "react-router";

const mapState = (state: ApplicationState) => {
  return {
    user: state.user,
  };
};

const connector = connect(mapState, UserStore.actionCreators);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {};

const UserStatsComponent = (props: Props) => {
  const { usernameParam } = useParams<{ usernameParam: string }>();
  const year = new Date().getMonth() + 1;
  const [statsSince, setStatsSince] = useState(year);
  const { fetchUserStats, user } = props;
  useEffect(() => {
    fetchUserStats(statsSince, usernameParam);
  }, [fetchUserStats, statsSince, usernameParam]);
  const stats = user?.userStats;

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
                  <option value={year}>Year to date</option>
                  <option value="0">All time</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="section pt-0">
        {stats && (
          <div className="">
            <div className="columns is-centered is-mobile">
              <div className="column has-text-centered">
                <h6 className="title is-6">Rounds played</h6>
                {stats.roundsPlayed}
              </div>
              <div className="column has-text-centered">
                <h6 className="title is-6">Holes played</h6>
                {stats.holesPlayed}
              </div>
            </div>
            <div className="columns is-centered is-mobile">
              <div className="column has-text-centered">
                <h6 className="title is-6">Fairway hit rate</h6>
                {(stats.fairwayHitRate * 100).toFixed(0)} %
              </div>
              <div className="column has-text-centered">
                <h6 className="title is-6">Scramble rate</h6>
                {(stats.scrambleRate * 100).toFixed(0)} %
              </div>
            </div>
            <div className="columns is-centered is-mobile">
              <div className="column has-text-centered">
                <h6 className="title is-6">Circle 1 rate</h6>
                {(stats.circle1Rate * 100).toFixed(0)} %
              </div>
              <div className="column has-text-centered">
                <h6 className="title is-6">Circle 2 rate</h6>
                {(stats.circle2Rate * 100).toFixed(0)} %
              </div>
            </div>
            <div className="columns is-centered is-mobile">
              <div className="column has-text-centered">
                <h6 className="title is-6">Birdie rate</h6>
                {(stats.birdieRate * 100).toFixed(0)} %
              </div>
              <div className="column has-text-centered">
                <h6 className="title is-6">OB rate</h6>
                {(stats.obRate * 100).toFixed(0)} %
              </div>
            </div>
            <div className="columns is-centered is-mobile">
              <div className="column has-text-centered">
                <h6 className="title is-6">Average score</h6>
                {`${stats.averageScore < 0 ? "-" : "+"}${Math.abs(
                  stats.averageScore
                ).toFixed(1)}`}
              </div>
              <div
                data-tooltip="Average score matched against the average of alle other players"
                className="has-tooltip has-tooltip-multiline column has-text-centered"
              >
                <h6 className="title is-6">Strokes gained</h6>
                {stats.strokesGained.toFixed(1)}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default connector(UserStatsComponent);
