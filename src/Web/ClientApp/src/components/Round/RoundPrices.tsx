import * as React from "react";
import { Round, HoleScore, PlayerScore } from "../../store/Rounds";

export interface RoundPricesProps {
  round: Round;
  swipeHandlers: any;
}

const mostBetterThan = (round: Round, f: (h: HoleScore) => boolean) => {
  const ofBetterThan = (score: PlayerScore) => score.scores.filter(f).length;
  const byBetterThan = round.playerScores
    .filter((s) => ofBetterThan(s) > 0)
    .sort((a, b) => {
      return ofBetterThan(b) - ofBetterThan(a);
    });

  return byBetterThan.length > 0 ? byBetterThan[0].playerName : null;
};

export default ({ round, swipeHandlers }: RoundPricesProps) => {
  const mostBirdies = mostBetterThan(round, (s) => s.relativeToPar < 0);
  const mostPars = mostBetterThan(round, (s) => s.relativeToPar === 0);
  const mostBogies = mostBetterThan(round, (s) => s.relativeToPar > 0);
  return (
    <div className="columns section" {...swipeHandlers}>
      {mostBirdies && (
        <div className="column">
          <div className="card has-background-success">
            <div className="card-content has-text-centered">
              Most birdies:
              <br />
              <span className="has-text-weight-bold is-size-3">
                {mostBirdies}
              </span>
            </div>
          </div>
        </div>
      )}
      {mostPars && (
        <div className="column">
          <div className="card">
            <div className="card-content has-text-centered">
              Most pars: <br />
              <span className="has-text-weight-bold is-size-3">{mostPars}</span>
            </div>
          </div>
        </div>
      )}
      {mostBogies && (
        <div className="column">
          <div className="card has-background-warning">
            <div className="card-content has-text-centered">
              Most bogies or worse:
              <br />
              <span className="has-text-weight-bold is-size-3">
                {mostBogies}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
