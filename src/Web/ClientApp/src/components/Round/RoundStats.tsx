import * as React from "react";
import { UserStats } from "../../store/User";
import { useState } from "react";

export interface RoundStatsProps {
  stats: UserStats[];
  username: string;
  swipeHandlers: any;
}

export default ({ stats, username, swipeHandlers }: RoundStatsProps) => {
  const [player, setPlayer] = useState(username);
  const userStats = stats.find((s) => s.username === player);
  return (
    <div {...swipeHandlers}>
      <div className="columns is-mobile">
        <div className="column is-half"></div>
        <div className="column is-half">
          <div className="field">
            <div className="control">
              <div className="select is-primary">
                <select
                  value={player}
                  onChange={(e) => {
                    setPlayer(e.target.value);
                  }}
                >
                  {stats.map((s) => (
                    <option value={s.username}>{s.username}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="section is-centered py-0">
        {userStats && (
          <>
            <div className="columns is-centered is-mobile">
              <div className="column has-text-centered">
                <h6 className="title is-6">Circle 1 puts</h6>
                {(userStats.circle1Rate * 100).toFixed(0)} %
              </div>
              <div className="column has-text-centered">
                <h6 className="title is-6">Circle 2 puts</h6>
                {(userStats.circle2Rate * 100).toFixed(0)} %
              </div>
            </div>
            <div className="columns is-centered is-mobile">
              <div className="column has-text-centered">
                <h6 className="title is-6">Fairways hit</h6>
                {(userStats.fairwayHitRate * 100).toFixed(0)} %
              </div>
              <div className="column has-text-centered">
                <h6 className="title is-6">OBs</h6>
                {(userStats.obRate * 100).toFixed(0)} %
              </div>
            </div>
            <div className="columns is-centered is-mobile">
              <div className="column has-text-centered">
                <h6 className="title is-6">Birdies</h6>
                {(userStats.birdieRate * 100).toFixed(0)} %
              </div>
              <div className="column has-text-centered">
                <h6 className="title is-6">Pars</h6>
                {(userStats.parRate * 100).toFixed(0)} %
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
