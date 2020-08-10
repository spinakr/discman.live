import React, { useState, useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { ApplicationState } from "../../store";
import {
  actionCreators as coursesActionCreator,
  Course,
} from "../../store/Courses";
import { actionCreators as tournamentsActionCreator } from "../../store/Tournaments";
import { useParams } from "react-router";

const mapState = (state: ApplicationState) => {
  return {
    courses: state.courses?.courses,
    username: state.user?.user?.username || "",
  };
};

const connector = connect(mapState, {
  ...coursesActionCreator,
  ...tournamentsActionCreator,
});

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {};

const AddCourse = (props: Props) => {
  let { tournamentId } = useParams();
  const [showDialog, setShowDialog] = useState(false);
  const [selectedLayout, setSelectedLayout] = useState<Course | undefined>(
    undefined
  );
  const [availableLayouts, setAvailableLayouts] = useState<
    Course[] | undefined
  >(undefined);
  const { fetchCourses } = props;
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

  useEffect(() => {
    showDialog && fetchCourses();
  }, [fetchCourses, showDialog]);

  return (
    <>
      <div className={showDialog ? "modal is-active" : "modal"}>
        <div onClick={() => setShowDialog(false)}>
          <div className="modal-background"></div>
        </div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Add course</p>
          </header>
          <section className="modal-card-body">
            <label className="label">Course</label>
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
          </section>
          <footer className="modal-card-foot">
            <button
              className="button is-success"
              onClick={() => {
                tournamentId &&
                  selectedLayout &&
                  props.addCourseToTournament(tournamentId, selectedLayout?.id);
                setShowDialog(false);
              }}
              disabled={!tournamentId || !selectedLayout}
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
        className="button is-primary is-small is-light is-outlined"
        onClick={() => setShowDialog(true)}
      >
        <strong>Add</strong>
      </button>
    </>
  );
};

export default connector(AddCourse);
