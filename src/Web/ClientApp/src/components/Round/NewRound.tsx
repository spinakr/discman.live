import React, { useState, useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { ApplicationState } from "../../store";
import {
  actionCreators as coursesActionCreator,
  Course,
} from "../../store/Courses";
import { actionCreators as loginActionCreator } from "../../store/User";
import {
  actionCreators as roundsActionCreator,
  ScoreMode,
} from "../../store/Rounds";
import InformationDialogue from "../InformationDialogue";

const mapState = (state: ApplicationState) => {
  return {
    courses: state.courses?.courses,
    friends: state.user?.friendUsers,
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
  const [showDialog, setShowDialog] = useState(false);
  const [selectedLayout, setSelectedLayout] = useState<Course | undefined>(
    undefined
  );
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [manualReg, setManualReg] = useState<boolean>(false);
  const [roundName, setRoundName] = useState<string>("");
  const [availableLayouts, setAvailableLayouts] = useState<
    Course[] | undefined
  >(undefined);
  const { fetchCourses, fetchUsers } = props;
  const courseSelected = (courseName: string) => {
    if (!props.courses) return;
    const layouts = props.courses.find((c) => c[0] === courseName);
    layouts && setAvailableLayouts(layouts[1]);
    layouts && setSelectedLayout(layouts[1][0]);
  };
  const layoutSelected = (courseId: string) => {
    const layout =
      availableLayouts && availableLayouts.find((l) => l.id === courseId);
    layout && setSelectedLayout(layout);
  };
  const playerAdded = (playerName: string) => {
    if (selectedPlayers.some((p) => p === playerName)) return;
    setSelectedPlayers([...selectedPlayers, playerName]);
  };
  const removePlayer = (playerName: string) => {
    setSelectedPlayers(selectedPlayers.filter((p) => p !== playerName));
  };

  const clearRoundInfo = () => {
    setSelectedPlayers([]);
    setRoundName("");
    setAvailableLayouts(undefined);
    setSelectedLayout(undefined);
  };

  const [scoreType, setScoreType] = useState<number>(ScoreMode.DetailedLive);

  useEffect(() => {
    showDialog && fetchCourses();
    showDialog && fetchUsers();
  }, [fetchCourses, fetchUsers, showDialog]);

  return (
    <>
      <div className={showDialog ? "modal is-active" : "modal"}>
        <div onClick={() => setShowDialog(false)}>
          <div className="modal-background"></div>
        </div>
        <div className="modal-card has-text-left">
          <header className="modal-card-head">
            <p className="modal-card-title">Start new round</p>
            <InformationDialogue
              title="Start Round"
              text={`Select course and layout.

On-the-fly mode allows adding new holes by reading par and distance of information signs on the actual course while playing.

After finishing the round, an actuall course can be created from the registered holes.`}
            />
          </header>
          <section className="modal-card-body">
            <label className="label">Scoring</label>
            <div className="field">
              <div className="control">
                <input
                  id="switchExample"
                  type="checkbox"
                  name="switchExample"
                  className="switch"
                  onChange={() => {
                    setManualReg(!manualReg);
                    clearRoundInfo();
                  }}
                />
                <label htmlFor="switchExample">On-the-fly</label>
              </div>
            </div>
            <div className="field">
              <div className="control">
                <div className="select is-primary">
                  <select
                    value={scoreType}
                    onChange={(e) => {
                      setScoreType(+e.target.value);
                    }}
                  >
                    <option value={ScoreMode.DetailedLive}>
                      Detailed live
                    </option>
                    <option value={ScoreMode.StrokesLive}>Simple live</option>
                  </select>
                </div>
              </div>
            </div>

            <label className="label">
              {manualReg ? "Round Name" : "Course"}
            </label>
            {manualReg === false ? (
              <>
                <div className="field">
                  <div className="control">
                    <div className="select is-primary">
                      <select onChange={(e) => courseSelected(e.target.value)}>
                        <option></option>
                        {props.courses?.map((c) => (
                          <option key={c[0]} value={c[0]}>
                            {c[0]}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="field">
                  <div className="control">
                    <div className="select is-primary">
                      <select onChange={(e) => layoutSelected(e.target.value)}>
                        {availableLayouts?.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.layout}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="field">
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    value={roundName}
                    onChange={(e) => setRoundName(e.target.value)}
                  ></input>
                </div>
              </div>
            )}
            <label className="label">Friends</label>
            <div className="field">
              <div className="control">
                <div className="select is-primary">
                  <select onChange={(e) => playerAdded(e.target.value)}>
                    <option></option>
                    {props.friends?.map((u) => (
                      <option key={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            {selectedPlayers.map((p) => (
              <span
                onClick={() => removePlayer(p)}
                key={p}
                className="tag is-black"
              >
                {p}
                <button className="delete is-small"></button>
              </span>
            ))}
          </section>
          <footer className="modal-card-foot">
            <button
              className="button is-success"
              onClick={() => {
                props.newRound(
                  selectedLayout?.id,
                  selectedPlayers,
                  roundName,
                  scoreType
                );
                setShowDialog(false);
              }}
            >
              Start
            </button>
            <button className="button" onClick={() => setShowDialog(false)}>
              Cancel
            </button>
          </footer>
        </div>
      </div>
      <button
        className="button is-primary is-light is-outlined"
        onClick={() => setShowDialog(true)}
      >
        <strong>New Round</strong>
      </button>
    </>
  );
};

export default connector(NewRound);
