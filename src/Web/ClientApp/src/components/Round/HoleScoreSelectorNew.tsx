/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Fragment, useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { ApplicationState } from "../../store";
import * as RoundsStore from "../../store/Rounds";
import { StrokeOutcome } from "../../store/Rounds";
import NewHole from "./NewHole";
import "./HoleScore.css";
import RoundStatus from "./RoundStatus";
import * as UserStore from "../../store/User";

const mapState = (state: ApplicationState) => {
  return {
    round: state.rounds && state.rounds.round,
    username: state.user?.user?.username || "",
    simpleScoring: state.user?.userDetails?.simpleScoring,
    activeHole: state.rounds && state.rounds.activeHole,
  };
};

const connector = connect(mapState, {
  ...RoundsStore.actionCreators,
  ...UserStore.actionCreators,
});

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {};

const renderSimpleSelector = (
  setScore: (score: number, strokes: StrokeOutcome[]) => void
) => {
  return (
    <div className="field is-grouped">
      {[...Array(4)].map((element, i) => (
        <div className="control" key={i}>
          <button
            className="button is-medium"
            onClick={() => setScore(i + 2, [])}
          >
            {i + 2}
          </button>
        </div>
      ))}
      <div className="control is-pulled-right" style={{ marginLeft: "auto" }}>
        <div className="select">
          <select
            value={""}
            onChange={(e) => {
              setScore(parseInt(e.target.value), []);
            }}
          >
            <option></option>
            <option>1</option>
            <option>6</option>
            <option>7</option>
            <option>8</option>
            <option>9</option>
            <option>10</option>
            <option>11</option>
            <option>12</option>
            <option>13</option>
            <option>14</option>
            <option>15</option>
          </select>
        </div>
      </div>
    </div>
  );
};

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
  const { round, activeHole, setScore, username, setScorecardOpen } = props;
  const [strokes, setStrokes] = useState<StrokeOutcome[]>([]);
  const isPartOfRound = round?.playerScores.some(
    (s) => s.playerName === username
  );
  const [completeActive, setCompleteActive] = useState(true);

  if (activeHole === 100 && !round?.isCompleted) {
    return (
      <div className="columns has-text-centered">
        <div className="column">{!round?.courseName && <NewHole />}</div>
        <div className="column">
          <button
            className="button is-success"
            onClick={() => {
              if (window.confirm("Do you want to complete the round?")) {
                props.completeRound();
                setCompleteActive(false);
              }
            }}
            disabled={!completeActive}
          >
            {" "}
            Complete Round{" "}
          </button>
        </div>
      </div>
    );
  }

  return round ? (
    <div className="container mx-0 mt-1 is-flex is-flex-direction-column is-justify-content-space-between">
      <div className="is-flex flex-direction-row is-justify-content-space-evenly">
        <a
          className="button button is-info is-light pr-1 pl-3"
          onClick={() => setScorecardOpen(true)}
        >
          <span className="icon">
            <i className="fas fa-lg fa-list-ol" aria-hidden="true"></i>
          </span>
          <span className="is-size-7">Scores</span>
        </a>
        <RoundStatus />
      </div>
      <div className="is-flex scrollable">
        {renderStrokes(strokes, setStrokes)}
      </div>
      {isPartOfRound && (
        <div className="columns is-gapless is-mobile is-flex mx-0">
          <div className="column">
            <div className="control py-1">
              <button
                className="button is-large tour-score-rough"
                title="Rough"
                onClick={() => setStrokes([...strokes, "Rough"])}
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
