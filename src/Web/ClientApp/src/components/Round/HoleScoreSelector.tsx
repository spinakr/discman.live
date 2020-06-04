import React, { useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { ApplicationState } from "../../store";
import * as RoundsStore from "../../store/Rounds";
import { StrokeOutcome, ScoreMode } from "../../store/Rounds";

const mapState = (state: ApplicationState) => {
  return {
    round: state.rounds && state.rounds.round,
    username: state.user?.user?.username || "",
    activeHole: state.rounds && state.rounds.activeHole,
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
      return <i className="has-text-weight-bold is-family-code">F</i>;
    case "Basket":
      return <i className="fas fa-lg fa-shopping-basket"></i>;
    case "Circle1":
      return <i className="has-text-weight-bold is-family-code">10m</i>;
    case "Circle2":
      return <i className="has-text-weight-bold is-family-code">20m</i>;
    case "Rough":
      return <i className="has-text-weight-bold is-family-code">R</i>;
    case "OB":
      return <i className="has-text-weight-bold is-family-code">OB</i>;
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
  return strokes.map((s, i) => {
    return (
      <span
        key={i}
        onClick={() =>
          setStrokes([...strokes.filter((e, i) => i !== strokes.length - 1)])
        }
      >
        <span className="icon is-large">{outcomeStyle(s)}</span>
        <span className="icon is-small">
          <i className="fas fa-arrow-right"></i>
        </span>
      </span>
    );
  });
};

const renderDetailedSelector = (
  setScore: (score: number, strokes: StrokeOutcome[]) => void,
  strokes: RoundsStore.StrokeOutcome[],
  setStrokes: React.Dispatch<React.SetStateAction<RoundsStore.StrokeOutcome[]>>
) => {
  return (
    <>
      <div className="field is-grouped tour-scores">
        <div className="control">
          <button
            className="button is-medium tour-score-fairway"
            title="Fairway"
            onClick={() => setStrokes([...strokes, "Fairway"])}
          >
            <span className="icon is-large">
              <i className="has-text-weight-bold is-family-code">F</i>
            </span>
          </button>
        </div>
        <div className="control">
          <button
            className="button is-medium tour-score-rough"
            title="Rough"
            onClick={() => setStrokes([...strokes, "Rough"])}
          >
            <span className="icon is-large">
              <i className="has-text-weight-bold is-family-code">R</i>
            </span>
          </button>
        </div>
        <div className="control">
          <button
            className="button is-medium tour-score-circle2"
            title="Circle 2 - 20 meters"
            onClick={() => setStrokes([...strokes, "Circle2"])}
          >
            <span className="icon is-large">
              <i className="has-text-weight-bold is-family-code">20m</i>
            </span>
          </button>
        </div>
        <div className="control">
          <button
            className="button is-medium tour-score-circle1"
            title="Circle 1 - 10 meters"
            onClick={() => setStrokes([...strokes, "Circle1"])}
          >
            <span className="icon is-large">
              <i className="has-text-weight-bold is-family-code">10m</i>
            </span>
          </button>
        </div>
        <div className="control">
          <button
            className="button is-medium tour-score-basket"
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
        <div className="control is-pulled-right" style={{ marginLeft: "auto" }}>
          <button
            className="button is-medium tour-score-ob"
            title="In basket"
            onClick={() => setStrokes([...strokes, "OB"])}
          >
            <span className="icon is-large icon has-text-danger">
              <i className="has-text-weight-bold is-family-code">OB</i>
            </span>
          </button>
        </div>
      </div>
      {renderStrokes(strokes, setStrokes)}
    </>
  );
};

const HoleScoreSelector = (props: Props) => {
  const { round, activeHole, setScore, username } = props;
  const [strokes, setStrokes] = useState<StrokeOutcome[]>([]);
  const isPartOfRound = round?.playerScores.some(
    (s) => s.playerName === username
  );

  if (activeHole === 100 && !round?.isCompleted) {
    return (
      <div className="has-text-centered">
        <button
          className="button is-success"
          onClick={() => {
            props.completeRound();
          }}
        >
          {" "}
          Complete Round{" "}
        </button>
      </div>
    );
  }

  return round && isPartOfRound ? (
    <>
      {round.scoreMode === ScoreMode.DetailedLive &&
        renderDetailedSelector(setScore, strokes, setStrokes)}
      {round.scoreMode === ScoreMode.StrokesLive &&
        renderSimpleSelector(setScore)}
      <hr />
    </>
  ) : null;
};

export default connector(HoleScoreSelector);
