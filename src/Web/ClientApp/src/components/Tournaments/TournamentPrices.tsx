import React from "react";
import { Tournament } from "../../store/Tournaments";

export interface TournamentPricesProps {
  tournament: Tournament;
  username: string;
}

export default ({ tournament, username }: TournamentPricesProps) => (
  <>
    {tournament.prices && (
      <div className="columns section py-3">
        {tournament.prices.bestPutter && (
          <div className="box has-background-success-light has-text-centered">
            Best putter
            <br />
            <div className="has-text-weight-bold is-size-4">
              {tournament.prices.bestPutter.username}
            </div>
            <div className="is-size-6">
              {(+tournament.prices.bestPutter.scoreValue).toFixed(1)} per hole
            </div>
          </div>
        )}
        {tournament.prices.mostAccurateDriver && (
          <div className="box has-background-success-light has-text-centered">
            Most accurate driver:
            <br />
            <div className="has-text-weight-bold is-size-4">
              {tournament.prices.mostAccurateDriver.username}
            </div>
            <div className="is-size-6">
              {(+tournament.prices.mostAccurateDriver.scoreValue * 100).toFixed(
                1
              )}{" "}
              % fairways hit
            </div>
          </div>
        )}
        {tournament.prices.fastestPlayer && (
          <div className="box has-background-success-light has-text-centered">
            Fastest player
            <br />
            <div className="has-text-weight-bold is-size-4">
              {tournament.prices.fastestPlayer.username}
            </div>
            <div className="is-size-6">
              {(+tournament.prices.fastestPlayer.scoreValue).toFixed(1)} min per
              hole
            </div>
          </div>
        )}
        {tournament.prices.slowestPlayer && (
          <div className="box has-background-warning-light has-text-centered">
            Slowest player
            <br />
            <div className="has-text-weight-bold is-size-4">
              {tournament.prices.slowestPlayer.username}
            </div>
            <div className="is-size-6">
              {(+tournament.prices.slowestPlayer.scoreValue).toFixed(1)} min per
              hole
            </div>
          </div>
        )}
        <br />
      </div>
    )}
  </>
);
