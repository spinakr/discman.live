/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { ApplicationState } from "../../store";
import { actionCreators as coursesActionCreator } from "../../store/Courses";

const mapState = (state: ApplicationState) => {
  return {};
};

const connector = connect(mapState, {
  ...coursesActionCreator,
});

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {};

const NewCourse = (props: Props) => {
  const [showDialog, setShowDialog] = useState(false);
  const [courseName, setCourseName] = useState<string>("");
  const [numberOfHoles, setNumberOfHoles] = useState<number>(0);

  return (
    <>
      <div className={showDialog ? "modal is-active" : "modal"}>
        <div onClick={() => setShowDialog(false)}>
          {" "}
          <div className="modal-background"></div>{" "}
        </div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Start new round</p>
          </header>
          <section className="modal-card-body">
            <div className="field">
              <label className="label">Course name</label>
              <input
                className="input"
                type="text"
                onChange={(e) => setCourseName(e.target.value)}
              ></input>
              <div className="control"></div>
            </div>
            <div className="field">
              <label className="label">Number of holes</label>
              <input
                className="input"
                type="number"
                onChange={(e) => setNumberOfHoles(+e.target.value)}
              ></input>
              <div className="control"></div>
            </div>
          </section>
          <footer className="modal-card-foot">
            <button
              className="button is-success"
              onClick={() => {
                props.createCourse(courseName, numberOfHoles);
                setShowDialog(false);
              }}
              disabled={!courseName || !numberOfHoles}
            >
              Save
            </button>
            <button className="button" onClick={() => setShowDialog(false)}>
              Cancel
            </button>
          </footer>
        </div>
      </div>
      <button
        className=" button is-primary is-light is-outlined"
        onClick={() => setShowDialog(true)}
      >
        <strong>New Course</strong>
      </button>
    </>
  );
};

export default connector(NewCourse);
