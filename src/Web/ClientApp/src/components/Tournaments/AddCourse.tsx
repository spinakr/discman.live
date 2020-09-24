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
  const [courseFilter, setCourseFilter] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string | undefined>();
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
    setSelectedCourse(courseName);
    layouts && setAvailableLayouts(layouts[1]);
    layouts && setSelectedLayout(layouts[1][0]);
  };
  const layoutSelected = (courseId: string) => {
    const layout =
      availableLayouts && availableLayouts.find((l) => l.id === courseId);
    layout && setSelectedLayout(layout);
  };

  useEffect(() => {
    showDialog && courseFilter.length > 2 && fetchCourses(courseFilter);
  }, [courseFilter, fetchCourses, showDialog]);

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
                <div className="control has-icons-left">
                  <input
                    className="input"
                    type="text"
                    placeholder="Search"
                    onChange={(e) => {
                      setCourseFilter(e.target.value);
                    }}
                  />
                  <span className="icon is-left">
                    <i className="fas fa-search" aria-hidden="true"></i>
                  </span>
                </div>
              </div>
              <div className="panel">
                {props.courses?.slice(0, 5).map((c) => (
                  <span
                    onClick={() => courseSelected(c[0])}
                    key={c[0]}
                    className={`panel-block ${
                      selectedCourse === c[0] && "is-active"
                    }`}
                  >
                    <span className="panel-icon">
                      <i className="fas fa-cloud-sun" aria-hidden="true"></i>
                    </span>
                    {c[0]}
                  </span>
                ))}
              </div>
              {availableLayouts &&
                availableLayouts.length > 0 &&
                availableLayouts[1] && (
                  <div className="field">
                    <div className="control">
                      <div className="select is-grey">
                        <select
                          onChange={(e) => layoutSelected(e.target.value)}
                        >
                          {availableLayouts?.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.layout}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}
            </>
          </section>
          <footer className="modal-card-foot">
            <button
              className="button is-success is-light is-outlined"
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
