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

  return byBetterThan.length > 0 ? (
    <span className="has-text-weight-bold is-size-4">
      {byBetterThan[0].playerName} ({byBetterThan[0].scores.filter(f).length})
    </span>
  ) : null;
};

export default ({ round, swipeHandlers }: RoundPricesProps) => {
  const mostBirdies = mostBetterThan(round, (s) => s.relativeToPar < 0);
  const mostPars = mostBetterThan(round, (s) => s.relativeToPar === 0);
  const mostBogies = mostBetterThan(round, (s) => s.relativeToPar > 0);
  return (
    <div className="columns section" {...swipeHandlers}>
      {mostBirdies && (
        <div className="box has-background-success-light has-text-centered">
          Most birdies:
          <br />
          {mostBirdies}
        </div>
      )}
      {mostPars && (
        <div className="box has-text-centered">
          Most pars: <br />
          {mostPars}
        </div>
      )}
      {mostBogies && (
        <div className="box has-background-danger-light has-text-centered">
          Most bogies or worse:
          <br />
          {mostBogies}
        </div>
      )}
    </div>
  );
};
