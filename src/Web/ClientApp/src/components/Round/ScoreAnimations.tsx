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

const birdies = [
  "birdie.png",
  "birdie1.png",
  "birdie2.png",
  "birdie3.png",
  "birdie4.png",
];

const getImage = (lastScore: RoundsStore.HoleScore) => {
  if (lastScore?.relativeToPar === -1) {
    return birdies[Math.floor(Math.random() * birdies.length)];
  }
};

const ScoreAnimations = (props: Props) => {
  const { round, user } = props;
  const scores = round?.playerScores;
  const userScores =
    scores &&
    scores
      .find((s) => s.playerName === user?.user?.username)
      ?.scores.slice()
      .reverse();

  const [animate, setAnimate] = useState("");

  const lastScore = userScores && userScores.find((s) => s.strokes !== 0);

  const isInitialMount = useRef(true);
  const previousScoreValue = useRef(lastScore);

  useEffect(() => {
    birdies.forEach((picture) => {
      const img = new Image();
      img.src = picture;
    });
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      if (
        lastScore &&
        lastScore?.hole.number !== previousScoreValue.current?.hole.number
      ) {
        const imageName = getImage(lastScore);
        if (!imageName) return;
        setAnimate(imageName);
        setTimeout(() => {
          setAnimate("");
        }, 20000);
      }
      previousScoreValue.current = lastScore;
    }
  }, [lastScore]);

  return (
    <div>
      {animate && (
        <figure className="image flier">
          <img src={animate} alt={animate} />
        </figure>
      )}
    </div>
  );
};

export default connector(ScoreAnimations);
