/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { ApplicationState } from "../store";
import {
  actionCreators as coursesActionCreator,
  Course,
} from "../store/Courses";
import { actionCreators as loginActionCreator } from "../store/Login";
import { actionCreators as roundsActionCreator } from "../store/Rounds";
import "./Login.css";

const mapState = (state: ApplicationState) => {
  return {
    courses: state.courses?.courses,
    friends: state.login?.friendUsers,
    username: state.login?.user?.username || "",
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
  const [selectedCourse, setSelectedCourse] = useState<Course>();
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const { fetchCourses, fetchUsers } = props;

  const courseSelected = (courseId: string) => {
    props.courses &&
      setSelectedCourse(props.courses.find((c) => c.id === courseId));
  };
  const playerAdded = (playerName: string) => {
    if (playerName === "") return;
    if (selectedPlayers.some((p) => p === playerName)) return;
    setSelectedPlayers([...selectedPlayers, playerName]);
  };
  const removePlayer = (playerName: string) => {
    setSelectedPlayers(selectedPlayers.filter((p) => p !== playerName));
  };

  useEffect(() => {
    showDialog && fetchCourses();
    showDialog && fetchUsers();
    if (!selectedPlayers.some((p) => p === props.username))
      setSelectedPlayers([props.username]);
  }, [fetchCourses, fetchUsers, props.username, selectedPlayers, showDialog]);

  return (
    <>
      <div className={showDialog ? "modal is-active" : "modal"}>
        <a href="" onClick={() => setShowDialog(false)}>
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
                    <option></option>
                    {props.courses?.map((c) => (
                      <option key={c.name} value={c.id}>
                        {c.name}
                      </option>
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
                    <option></option>
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
                selectedCourse &&
                  props.newRound(selectedCourse, selectedPlayers);
                setShowDialog(false);
              }}
              disabled={!selectedCourse || selectedPlayers.length === 0}
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
