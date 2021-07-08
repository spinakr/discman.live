/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Fragment, useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { ApplicationState } from "../../store";
import * as RoundsStore from "../../store/Rounds";
import { StrokeOutcome } from "../../store/Rounds";
import "./HoleScore.css";
import RoundStatus from "./RoundStatus";
import * as UserStore from "../../store/User";
import colors from "../../colors";

const mapState = (state: ApplicationState) => {
  return {
    round: state.rounds && state.rounds.round,
    username: state.user?.user?.username || "",
    simpleScoring: state.user?.userDetails?.simpleScoring,
    activeHoleIndex: state.rounds && state.rounds.activeHoleIndex,
  };
};

const connector = connect(mapState, {
  ...RoundsStore.actionCreators,
  ...UserStore.actionCreators,
});

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {};

const outcomeStyle = (s: StrokeOutcome) => {
  switch (s) {
    case "Fairway":
      return <i className="has-text-weight-bold is-family-code is-size-4">F</i>;
    case "Basket":
      return <i className="fas fa-lg fa-shopping-basket is-size-4"></i>;
    case "Circle1":
      return (
        <i className="has-text-weight-bold is-family-code is-size-4">10m</i>
      );
    case "Circle2":
      return (
        <i className="has-text-weight-bold is-family-code is-size-4">20m</i>
      );
    case "Rough":
      return <i className="has-text-weight-bold is-family-code is-size-4">R</i>;
    case "OB":
      return (
        <i className="has-text-weight-bold is-family-code is-size-4">OB</i>
      );
  }
};

const countScore = (strokes: StrokeOutcome[]) => {
  const obs = strokes.filter((s) => s === "OB").length;
  return obs === 0 ? strokes.length : strokes.length + obs;
};

const renderStrokes = (
  strokes: RoundsStore.StrokeOutcome[],
  setStrokes: React.Dispatch<React.SetStateAction<RoundsStore.StrokeOutcome[]>>
) => {
  return (
    <>
      <span>&nbsp;</span>
      {strokes.map((s, i) => {
        return (
          <Fragment key={i}>
            <span
              className="icon is-large"
              onClick={() =>
                setStrokes([
                  ...strokes.filter((e, i) => i !== strokes.length - 1),
                ])
              }
            >
              {outcomeStyle(s)}
            </span>
            <span className="icon is-large">
              <i className="fas fa-arrow-right"></i>
            </span>
          </Fragment>
        );
      })}
    </>
  );
};

const HoleScoreSelector = (props: Props) => {
  const {
    round,
    activeHoleIndex,
    setScore,
    username,
    setScorecardOpen,
    simpleScoring,
    setSimpleScoring,
  } = props;
  const [strokes, setStrokes] = useState<StrokeOutcome[]>([]);
  const [strokeCount, setStrokeCount] = useState(3);
  const isPartOfRound = round?.playerScores.some(
    (s) => s.playerName === username
  );
  if (!isPartOfRound) return null;
  const resetStrokeCount = () => {
    const activeholeDetailes = (round?.playerScores[0].scores || [])[
      activeHoleIndex || 0
    ];
    setStrokeCount(activeholeDetailes?.hole.par || 3);
  };

  return round ? (
    <div className="container mx-0 mt-1 is-flex is-flex-direction-column is-justify-content-space-between">
      <div className="is-flex flex-direction-row is-justify-content-space-evenly">
        <button
          className="button pr-1 pl-3 is-small"
          onClick={() => setScorecardOpen(true)}
          style={{ backgroundColor: colors.button }}
        >
          <span className="icon">
            <i className="fas fa-lg fa-list-ol"></i>
          </span>
          <span className="is-size-7">Scores</span>
        </button>
        <RoundStatus />
        <button
          className="button pr-1 pl-3 is-small"
          onClick={() => setSimpleScoring(!simpleScoring)}
          style={{ backgroundColor: colors.button }}
        >
          <span className="icon">
            <i className="fas fa-lg fa-clipboard-list"></i>
          </span>
          <span className="is-size-7">
            {simpleScoring ? "Detailed" : "Simple"}
          </span>
        </button>
      </div>
      <div className="is-flex scrollable">
        {renderStrokes(strokes, setStrokes)}
      </div>
      {props.simpleScoring ? (
        <>
          <div className="columns is-mobile is-flex pb-5">
            <div className="column">
              <div className="control py-1">
                <button
                  className="button is-large"
                  onClick={() => setStrokeCount(strokeCount - 1)}
                  style={{ backgroundColor: colors.circle1 }}
                >
                  <span className="icon is-large">
                    <i className="has-text-weight-bold is-family-code">-</i>
                  </span>
                </button>
              </div>
            </div>
            <div className="column">
              <div className="control py-1">
                <button
                  className="button is-large"
                  onClick={() => {
                    setScore(strokeCount, []);
                    resetStrokeCount();
                  }}
                  style={{ backgroundColor: colors.background }}
                >
                  <span className="icon is-large">
                    <i className="has-text-weight-bold is-family-code">
                      {strokeCount}
                    </i>
                  </span>
                </button>
              </div>
            </div>
            <div className="column">
              <div className="control py-1">
                <button
                  className="button is-large"
                  onClick={() => setStrokeCount(strokeCount + 1)}
                  style={{ backgroundColor: colors.rough }}
                >
                  <span className="icon is-large">
                    <i className="has-text-weight-bold is-family-code">+</i>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        //Detailed scoring
        <div className="columns is-gapless is-mobile is-flex mx-0">
          <div className="column">
            <div className="control py-1">
              <button
                className="button is-large"
                title="Rough"
                onClick={() => setStrokes([...strokes, "Rough"])}
                style={{ backgroundColor: colors.rough }}
              >
                <span className="icon is-large">
                  <i className="has-text-weight-bold is-family-code">R</i>
                </span>
              </button>
            </div>
            <div className="control py-1">
              <button
                className="button is-large tour-score-fairway"
                title="Fairway"
                onClick={() => setStrokes([...strokes, "Fairway"])}
                style={{ backgroundColor: colors.fairway }}
              >
                <span className="icon is-large">
                  <i className="has-text-weight-bold is-family-code">F</i>
                </span>
              </button>
            </div>
          </div>
          <div className="column">
            <div className="control py-1">
              <button
                className="button is-large tour-score-circle2"
                title="Circle 2 - 20 meters"
                onClick={() => setStrokes([...strokes, "Circle2"])}
                style={{ backgroundColor: colors.circle2 }}
              >
                <span className="icon is-large">
                  <i className="has-text-weight-bold is-family-code">20m</i>
                </span>
              </button>
            </div>
            <div className="control py-1">
              <button
                className="button is-large tour-score-circle1"
                title="Circle 1 - 10 meters"
                onClick={() => setStrokes([...strokes, "Circle1"])}
                style={{ backgroundColor: colors.circle1 }}
              >
                <span className="icon is-large">
                  <i className="has-text-weight-bold is-family-code">10m</i>
                </span>
              </button>
            </div>
          </div>
          <div className="column">
            <div className="control py-1">
              <button
                className="button is-large tour-score-ob"
                title="In basket"
                onClick={() => setStrokes([...strokes, "OB"])}
                style={{ backgroundColor: colors.ob }}
              >
                <span className="icon is-large icon has-text-danger">
                  <i className="has-text-weight-bold is-family-code">OB</i>
                </span>
              </button>
            </div>
            <div className="control py-1">
              <button
                className="button is-large tour-score-basket"
                title="In basket"
                onClick={() => {
                  const newStrokes: StrokeOutcome[] = [...strokes, "Basket"];
                  setScore(countScore(newStrokes), strokes);
                  setStrokes([]);
                }}
                style={{ backgroundColor: colors.background }}
              >
                <span className="icon is-large has-text-primary">
                  <i className="fas fa-shopping-basket">
                    &nbsp;{countScore(strokes) + 1}&nbsp;
                  </i>
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  ) : null;
};

export default connector(HoleScoreSelector);
