/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { ApplicationState } from "../../store";
import * as CoursesStore from "../../store/Courses";
import { useHistory } from "react-router";

const mapState = (state: ApplicationState) => {
  return {
    courses: state.courses?.courses || [],
  };
};

const connector = connect(mapState, CoursesStore.actionCreators);

interface NewCourseProps {
  currentCourseName: string | undefined;
}

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & NewCourseProps;

const NewCourse = (props: Props) => {
  const { createCourse, currentCourseName } = props;
  const history = useHistory();
  const [showDialog, setShowDialog] = useState(false);
  const [layoutName, setLayoutName] = useState<string>("");
  const [courseName, setCourseName] = useState<string>(currentCourseName || "");
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
            <p className="modal-card-title">New Course Layout</p>
          </header>
          <section className="modal-card-body">
            <div className="field">
              <label className="label">Course name</label>
              <input
                className="input"
                type="text"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                disabled={!!currentCourseName}
              ></input>
              <div className="control"></div>
            </div>
            {props.currentCourseName && (
              <div className="field">
                <label className="label">Layout Name</label>
                <input
                  className="input"
                  type="text"
                  value={layoutName}
                  onChange={(e) => setLayoutName(e.target.value)}
                ></input>
                <div className="control"></div>
              </div>
            )}
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
                createCourse(courseName, layoutName, numberOfHoles);
                setShowDialog(false);
                history.push(`/courses/${courseName}/${layoutName}`);
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
        <strong>{currentCourseName ? "New Layout" : "New Course"}</strong>
      </button>
    </>
  );
};

export default connector(NewCourse);
