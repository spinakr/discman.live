import React from "react";
import { Tournament } from "../../store/Tournaments";

export interface TournamentPricesProps {
  tournament: Tournament;
  username: string;
}

// public TournamentPrice FastestPlayer { get; set; }
// public TournamentPrice SlowestPlayer { get; set; }
// public TournamentPrice MostBirdies { get; set; }
// public TournamentPrice LeastBogeysOrWorse { get; set; }
// public TournamentPrice LongestCleanStreak { get; set; }
// public TournamentPrice LongestDrySpell { get; set; }
// public TournamentPrice BounceBacks { get; set; }

export default ({ tournament, username }: TournamentPricesProps) => (
  <>
    {tournament.prices && (
      <div className="columns section py-3">
        {tournament.prices.mostBirdies && (
          <div className="box has-background-success-light has-text-centered">
            Most birdies
            <br />
            <div className="has-text-weight-bold is-size-4">
              {tournament.prices.mostBirdies.username}
            </div>
            <div className="is-size-6">
              {+tournament.prices.mostBirdies.scoreValue}
            </div>
          </div>
        )}
        {tournament.prices.leastBogeysOrWorse && (
          <div className="box has-background-success-light has-text-centered">
            Least bogeys or worse:
            <br />
            <div className="has-text-weight-bold is-size-4">
              {tournament.prices.leastBogeysOrWorse.username}
            </div>
            <div className="is-size-6">
              {tournament.prices.leastBogeysOrWorse.scoreValue}
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
        {tournament.prices.longestCleanStreak && (
          <div className="box has-background-success-light has-text-centered">
            Longest bogey free streak
            <br />
            <div className="has-text-weight-bold is-size-4">
              {tournament.prices.longestCleanStreak.username}
            </div>
            <div className="is-size-6">
              {tournament.prices.longestCleanStreak.scoreValue} holes
            </div>
          </div>
        )}
        {tournament.prices.longestDrySpell && (
          <div className="box has-background-warning-light has-text-centered">
            Longest bird-less streak
            <br />
            <div className="has-text-weight-bold is-size-4">
              {tournament.prices.longestDrySpell.username}
            </div>
            <div className="is-size-6">
              {tournament.prices.longestDrySpell.scoreValue} holes
            </div>
          </div>
        )}
        {tournament.prices.bounceBacks && (
          <div className="box has-background-success-light has-text-centered">
            Most bounce-backs
            <br />
            <div className="has-text-weight-bold is-size-4">
              {tournament.prices.bounceBacks.username}
            </div>
            <div className="is-size-6">
              {tournament.prices.bounceBacks.scoreValue} holes
            </div>
          </div>
        )}
        <br />
      </div>
    )}
  </>
);
