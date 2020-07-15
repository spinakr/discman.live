import React, { useEffect, useState, useRef } from "react";
import { connect, ConnectedProps } from "react-redux";
import { ApplicationState } from "../../store";
import * as RoundsStore from "../../store/Rounds";
import "./AchievementAnimations.css";

const mapState = (state: ApplicationState) => {
  return {
    round: state.rounds && state.rounds.round,
    user: state.user,
  };
};

const connector = connect(mapState, RoundsStore.actionCreators);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {};

const ScoreAnimations = (props: Props) => {
  const { round, user } = props;
  const scores = round?.playerScores;
  const userScores =
    scores &&
    scores
      .find((s) => s.playerName === user?.user?.username)
      ?.scores.slice()
      .reverse();

  const [animate, setAnimate] = useState(false);

  const lastScore = userScores && userScores.find((s) => s.strokes !== 0);

  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      if (lastScore?.relativeToPar === -1) {
        setAnimate(true);
        setTimeout(() => {
          setAnimate(false);
        }, 7500);
      }
    }
  }, [lastScore]);

  return (
    <div>
      {animate && (
        <figure className="image flier">
          <img src="birdie.png" alt="Birdie" />
        </figure>
      )}
    </div>
  );
};

export default connector(ScoreAnimations);
