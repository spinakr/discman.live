import React, { useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { ApplicationState } from "../../store";
import { actionCreators as roundActionCreator } from "../../store/Rounds";

const mapState = (state: ApplicationState) => {
  return {};
};

const connector = connect(mapState, {
  ...roundActionCreator,
});

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const SaveCourseFromRound = (props: Props) => {
  const [showDialog, setShowDialog] = useState(false);
  const [courseName, setCourseName] = useState<string>("");

  return (
    <>
      <div className={showDialog ? "modal is-active" : "modal"}>
        <div onClick={() => setShowDialog(false)}>
          {" "}
          <div className="modal-background"></div>{" "}
        </div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Save round</p>
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
          </section>
          <footer className="modal-card-foot">
            <button
              className="button is-success"
              onClick={() => {
                props.saveAsCourse(courseName);
                setShowDialog(false);
              }}
              disabled={!courseName}
            >
              Save
            </button>
            <button className="button" onClick={() => setShowDialog(false)}>
              Cancel
            </button>
          </footer>
        </div>
      </div>
      <a className="panel-block" onClick={() => setShowDialog(true)}>
        <span className="panel-icon">
          <i className="fas fa-lg fa-user-friends"></i>
        </span>
        &nbsp;Save as course
      </a>
    </>
  );
};

export default connector(SaveCourseFromRound);
