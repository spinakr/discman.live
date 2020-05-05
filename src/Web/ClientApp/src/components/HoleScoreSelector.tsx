import React, { useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { ApplicationState } from "../store";
import * as RoundsStore from "../store/Rounds";
import { StrokeOutcome } from "../store/Rounds";

const mapState = (state: ApplicationState) => {
  return {
    rounds: state.rounds && state.rounds,
  };
};

const connector = connect(mapState, RoundsStore.actionCreators);

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
          </select>
        </div>
      </div>
    </div>
  );
};

const outcomeStyle = (s: StrokeOutcome) => {
  switch (s) {
    case "Fairway":
      return "fas fa-lg fa-check";
    case "Basket":
      return "fas fa-lg fa-shopping-basket";
    case "Circle1":
      return "fas fa-lg fa-dot-circle";
    case "Circle2":
      return "fas fa-lg fa-circle";
    case "Rough":
      return "fas fa-lg fa-times";
    case "OB":
      return "fas fa-lg fa-exclamation-triangle";
  }
};

const countScore = (strokes: StrokeOutcome[]) => {
  const obs = strokes.filter((s) => s === "OB").length;
  return obs === 0 ? strokes.length : strokes.length + obs;
};

const renderDetailedSelector = (
  setScore: (score: number, strokes: StrokeOutcome[]) => void,
  strokes: RoundsStore.StrokeOutcome[],
  setStrokes: React.Dispatch<React.SetStateAction<RoundsStore.StrokeOutcome[]>>
) => {
  return (
    <>
      <div className="field is-grouped">
        <div className="control">
          <button
            className="button is-medium"
            title="Fairway"
            onClick={() => setStrokes([...strokes, "Fairway"])}
          >
            <span className="icon is-large">
              <i className="fas fa-lg fa-check"></i>
            </span>
          </button>
        </div>
        <div className="control">
          <button
            className="button is-medium"
            title="Rough"
            onClick={() => setStrokes([...strokes, "Rough"])}
          >
            <span className="icon is-large">
              <i className="fas fa-lg fa-times"></i>
            </span>
          </button>
        </div>
        <div className="control">
          <button
            className="button is-medium"
            title="Circle 2 - 20 meters"
            onClick={() => setStrokes([...strokes, "Circle2"])}
          >
            <span className="icon is-large">
              <i className="fas fa-lg fa-circle"></i>
            </span>
          </button>
        </div>
        <div className="control">
          <button
            className="button is-medium"
            title="Circle 1 - 10 meters"
            onClick={() => setStrokes([...strokes, "Circle1"])}
          >
            <span className="icon is-large">
              <i className="fas fa-lg fa-dot-circle"></i>
            </span>
          </button>
        </div>
        <div className="control">
          <button
            className="button is-medium"
            title="In basket"
            onClick={() => {
              const newStrokes: StrokeOutcome[] = [...strokes, "Basket"];
              setScore(countScore(newStrokes), strokes);
              setStrokes([]);
            }}
          >
            <span className="icon is-large has-text-primary">
              <i className="fas fa-lg fa-shopping-basket"></i>
            </span>
          </button>
        </div>
        <div className="control is-pulled-right" style={{ marginLeft: "auto" }}>
          <button
            className="button is-medium"
            title="In basket"
            onClick={() => setStrokes([...strokes, "OB"])}
          >
            <span className="icon is-large icon has-text-danger">
              <i className="fas fa-lg fa-exclamation-triangle"></i>
            </span>
          </button>
        </div>
      </div>
      {strokes.map((s, i) => {
        return (
          <span key={i}>
            <span className="icon is-large">
              <i className={outcomeStyle(s)}></i>
            </span>
            <span className="icon is-small">
              <i className="fas fa-arrow-right"></i>
            </span>
          </span>
        );
      })}
    </>
  );
};

const HoleScoreSelector = (props: Props) => {
  const { rounds, setScore } = props;
  const [strokes, setStrokes] = useState<StrokeOutcome[]>([]);

  return rounds && rounds.round ? (
    <>
      {renderDetailedSelector(setScore, strokes, setStrokes)}
      <hr />
      {renderSimpleSelector(setScore)}
    </>
  ) : null;
};

export default connector(HoleScoreSelector);
