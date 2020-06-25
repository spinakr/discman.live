import React, { useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { ApplicationState } from "../../store";
import { actionCreators as roundsActionCreator } from "../../store/Rounds";

const mapState = (state: ApplicationState) => {
  return {
    round: state.rounds?.round,
  };
};

const connector = connect(mapState, {
  ...roundsActionCreator,
});

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {};

const NewHole = (props: Props) => {
  const [showDialog, setShowDialog] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState<number>(0);
  const [selectedPar, setSelectedPar] = useState<number>(3);
  const [selectedDistance, setSelectedDistance] = useState<
    number | undefined
  >();
  const { addHole, round } = props;

  const onDialogOpen = () => {
    const firstScores = round?.playerScores[0].scores;
    const currentLastHole =
      firstScores &&
      firstScores.length > 0 &&
      firstScores[firstScores.length - 1].hole.number;
    setSelectedNumber((currentLastHole || 0) + 1);
    setShowDialog(true);
  };

  return (
    <>
      <div className={showDialog ? "modal is-active" : "modal"}>
        <div onClick={() => setShowDialog(false)}>
          <div className="modal-background"></div>
        </div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Add new hole</p>
          </header>
          <section className="modal-card-body">
            <div className="field">
              <label className="label">Hole number</label>
              <div className="select">
                <select
                  value={selectedNumber}
                  className="input"
                  onChange={(e) => setSelectedNumber(+e.target.value)}
                >
                  {[...new Array(30)].map((x, i) => (
                    <option key={i}>{i}</option>
                  ))}
                  <option>-1</option>
                  <option>-2</option>
                  <option>-3</option>
                </select>
              </div>
              <div className="control"></div>
            </div>
            <div className="field">
              <label className="label">Par</label>
              <div className="select">
                <select
                  value={selectedPar}
                  onChange={(e) => setSelectedPar(+e.target.value)}
                >
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                </select>
              </div>
              <div className="control"></div>
            </div>
            <div className="field">
              <label className="label">Distance</label>
              <input
                value={selectedDistance}
                className="input"
                type="number"
                onChange={(e) => setSelectedDistance(+e.target.value)}
              ></input>
              <div className="control"></div>
            </div>
            <br />
          </section>
          <footer className="modal-card-foot">
            <button
              className="button is-success"
              onClick={() => {
                addHole(selectedNumber, selectedPar, selectedDistance || 0);
                setShowDialog(false);
              }}
            >
              Save
            </button>
            <button className="button" onClick={() => setShowDialog(false)}>
              Cancel
            </button>
          </footer>
        </div>
      </div>
      <button className="button is-primary" onClick={() => onDialogOpen()}>
        <strong>Add Hole</strong>
      </button>
    </>
  );
};

export default connector(NewHole);
