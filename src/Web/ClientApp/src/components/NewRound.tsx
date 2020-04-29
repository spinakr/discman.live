import React, { useState, useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { ApplicationState } from "../store";
import { actionCreators as coursesActionCreator } from "../store/Courses";
import { actionCreators as loginActionCreator } from "../store/Login";
import { actionCreators as roundsActionCreator } from "../store/Rounds";
import "./Login.css";

const mapState = (state: ApplicationState) => {
  return {
    courses: state.courses?.courses,
    friends: state.login?.friendUsers,
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
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const { fetchCourses, fetchUsers } = props;
  useEffect(() => {
    showDialog && fetchCourses();
    showDialog && fetchUsers();
  }, [fetchCourses, fetchUsers, showDialog]);
  const courseSelected = (courseName: string) => {
    setSelectedCourse(courseName);
  };
  const playerAdded = (playerName: string) => {
    setSelectedPlayers([...selectedPlayers, playerName]);
  };
  const removePlayer = (playerName: string) => {
    setSelectedPlayers(selectedPlayers.filter((p) => p !== playerName));
  };

  return (
    <>
      <div className={showDialog ? "modal is-active" : "modal"}>
        <a onClick={() => setShowDialog(false)}>
          {" "}
          <div className="modal-background"></div>{" "}
        </a>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Start new round</p>
          </header>
          <section className="modal-card-body">
            <div className="field">
              <label className="label">Course</label>
              <div className="control">
                <div className="select is-primary">
                  <select onChange={(e) => courseSelected(e.target.value)}>
                    {props.courses?.map((c) => (
                      <option key={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="field">
              <label className="label">Players</label>
              <div className="control">
                <div className="select is-primary">
                  <select onChange={(e) => playerAdded(e.target.value)}>
                    {props.friends?.map((u) => (
                      <option key={u}>{u}</option>
                    ))}
                  </select>
                </div>
                {selectedPlayers.map((p) => (
                  <span
                    onClick={() => removePlayer(p)}
                    key={p}
                    className="tag is-black"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </section>
          <footer className="modal-card-foot">
            <button
              className="button is-success"
              onClick={() => {
                props.newRound(selectedCourse, selectedPlayers);
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
