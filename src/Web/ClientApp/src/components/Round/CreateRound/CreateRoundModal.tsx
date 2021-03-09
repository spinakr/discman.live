import React, { useState, useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { ApplicationState } from "../../../store";
import {
  actionCreators as coursesActionCreator,
  Course,
} from "../../../store/Courses";
import { actionCreators as loginActionCreator } from "../../../store/User";
import {
  actionCreators as roundsActionCreator,
  Hole,
  ScoreMode,
} from "../../../store/Rounds";
import InformationDialogue from "../../InformationDialogue";
import { useMountEffect } from "../../../utils";
import colors from "../../../colors";
import AddFriends from "../../AddFriends";
import Steps from "./Steps";
import CourseSelector from "./CourseSelector";
import PlayersSelector from "./PlayersSelector";

const mapState = (state: ApplicationState) => {
  return {
    courses: state.courses?.courses,
    username: state.user?.user?.username || "",
  };
};

const connector = connect(mapState, {
  ...coursesActionCreator,
  ...loginActionCreator,
  ...roundsActionCreator,
});

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {};

const NewRound = (props: Props) => {
  const [activeStep, setActiveStep] = useState(1);

  const [showDialog, setShowDialog] = useState(false);
  const [selectedLayout, setSelectedLayout] = useState<Course | undefined>(
    undefined
  );

  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [manualReg, setManualReg] = useState<boolean>(false);
  const [roundName, setRoundName] = useState<string>("");

  const cancel = () => {
    setSelectedPlayers([]);
    setRoundName("");
    setSelectedLayout(undefined);
    setActiveStep(1);
    setShowDialog(false);
  };

  return (
    <>
      {showDialog && (
        <div className="modal is-active">
          <div onClick={() => setShowDialog(false)}>
            <div className="modal-background"></div>
          </div>
          <div className="modal-card has-text-left">
            <header
              className="modal-card-head"
              style={{ backgroundColor: colors.navbar }}
            >
              <Steps activeStep={activeStep} setActiveStep={setActiveStep} />
            </header>
            <section
              className="modal-card-body px-3"
              style={{ backgroundColor: colors.background }}
            >
              {activeStep === 1 && (
                <CourseSelector
                  setSelectedLayout={setSelectedLayout}
                  selectedLayout={selectedLayout}
                />
              )}
              {activeStep === 2 && (
                <PlayersSelector
                  selectedPlayers={selectedPlayers}
                  setSelectedPlayers={setSelectedPlayers}
                />
              )}
              {activeStep === 3 && selectedLayout && (
                <div>
                  <h3 className="title is-3 is-inline-block">
                    {selectedLayout.name}&nbsp;-&nbsp;
                  </h3>
                  <h3 className="subtitle is-5 is-inline-block">
                    {selectedLayout.layout}
                  </h3>
                  <div className="buttons">
                    {selectedPlayers.map((p) => (
                      <button
                        className="button px-2 is-primary is-inverted"
                        key={p}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </section>

            <footer
              className="modal-card-foot"
              style={{ backgroundColor: colors.navbar }}
            >
              <div className="field is-grouped">
                <p className="control">
                  {activeStep === 3 ? (
                    <button
                      className="button"
                      onClick={() => {
                        props.newRound(
                          selectedLayout?.id,
                          selectedPlayers,
                          roundName,
                          ScoreMode.DetailedLive
                        );
                        setShowDialog(false);
                      }}
                      disabled={
                        (!selectedLayout && !manualReg) ||
                        (manualReg && !roundName)
                      }
                    >
                      Start
                    </button>
                  ) : (
                    <button
                      className="button"
                      onClick={() => {
                        setActiveStep(activeStep + 1);
                      }}
                    >
                      Next
                    </button>
                  )}
                </p>
                <p className="control is-right">
                  <button
                    className="button"
                    onClick={() => {
                      cancel();
                    }}
                    style={{ backgroundColor: colors.background }}
                  >
                    Cancel
                  </button>
                </p>
              </div>
            </footer>
          </div>
        </div>
      )}
      <button
        onClick={() => setShowDialog(true)}
        className="button pr-1 pl-3"
        style={{ backgroundColor: colors.navbar }}
      >
        <span className="icon">
          <i className="fas fa-lg fa-play" aria-hidden="true"></i>
        </span>
        <span className="is-size-7">Play</span>
      </button>
    </>
  );
};

export default connector(NewRound);
