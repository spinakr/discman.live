import React, { useState, useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { ApplicationState } from "../../store";
import {
  actionCreators as coursesActionCreator,
  Course,
} from "../../store/Courses";
import { actionCreators as loginActionCreator } from "../../store/User";
import { actionCreators as roundsActionCreator } from "../../store/Rounds";

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
  const [selectedCourse, setSelectedCourse] = useState<Course | undefined>(
    undefined
  );
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [manualReg, setManualReg] = useState<boolean>(false);
  const [roundName, setRoundName] = useState<string>("");
  const { fetchCourses, fetchUsers } = props;
  const courseSelected = (courseId: string) => {
    props.courses &&
      setSelectedCourse(props.courses.find((c) => c.id === courseId));
  };
  const playerAdded = (playerName: string) => {
    if (selectedPlayers.some((p) => p === playerName)) return;
    setSelectedPlayers([...selectedPlayers, playerName]);
  };
  const removePlayer = (playerName: string) => {
    setSelectedPlayers(selectedPlayers.filter((p) => p !== playerName));
  };

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
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Start new round</p>
          </header>
          <section className="modal-card-body">
            <label className="label">
              {manualReg ? "Round Name" : "Course"}
            </label>
            <div className="field is-grouped">
              {manualReg === false ? (
                <>
                  <div className="control">
                    <div className="select is-primary">
                      <select onChange={(e) => courseSelected(e.target.value)}>
                        <option></option>
                        {props.courses?.map((c) => (
                          <option key={c.name} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    {!selectedCourse && <span></span>}
                  </div>
                </>
              ) : (
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    value={roundName}
                    onChange={(e) => setRoundName(e.target.value)}
                  ></input>
                </div>
              )}
              <div className="control">
                <label className="checkbox">
                  <input
                    type="checkbox"
                    onChange={() => setManualReg(!manualReg)}
                  />
                  Manual registration
                </label>
              </div>
            </div>
            <label className="label">Friends</label>
            <div className="field is-grouped">
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
            <br />
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
                props.newRound(selectedCourse, selectedPlayers, roundName);
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
      <button className="button is-primary" onClick={() => setShowDialog(true)}>
        <strong>New Round</strong>
      </button>
    </>
  );
};

export default connector(NewRound);
