import { Point } from "pigeon-maps";
import React, { useState, useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { Link } from "react-router-dom";
import colors from "../../../colors";
import { ApplicationState } from "../../../store";
import {
  actionCreators as coursesActionCreator,
  Coordinates,
  Course,
} from "../../../store/Courses";
import { Hole } from "../../../store/Rounds";
import { useMountEffect } from "../../../utils";
import NewCourse from "../../Courses/NewCourse";
import CoursesMap from "./CoursesMap";
import "./CreateRound.css";

const mapState = (state: ApplicationState) => {
  return {
    courses: state.courses?.courses,
    friends: state.user?.userDetails?.friends,
    username: state.user?.user?.username || "",
  };
};

const connector = connect(mapState, {
  ...coursesActionCreator,
});

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  setSelectedLayout: React.Dispatch<React.SetStateAction<Course | undefined>>;
  selectedLayout: Course | undefined;
  closeDialog: () => void;
};

interface Chunk {
  header: JSX.Element;
  par: JSX.Element;
}

const tableComps = (holeNumber: number, holePar: number) => {
  const header = (key: number) => (
    <th key={key} className="has-text-centered">
      {holeNumber} <br />
    </th>
  );
  const par = (key: number) => (
    <td key={key} className="has-text-centered">
      <i>{holePar}</i>
    </td>
  );
  return { header, par };
};

const chunkArray = (holes: Hole[], chunk_size: number) => {
  var index = 0;
  var arrayLength = holes.length;
  var tempArray = [];

  for (index = 0; index < arrayLength; index += chunk_size) {
    const myChunk = holes.slice(index, index + chunk_size);
    const size = myChunk.length;
    myChunk.length = chunk_size;
    const tableChunk = myChunk
      .fill({} as Hole, size, chunk_size)
      .map((c) => tableComps(c.number, c.par));

    tempArray.push(tableChunk);
  }

  return tempArray;
};

const CourseSelector = (props: Props) => {
  const {
    fetchCourses,
    setSelectedLayout,
    selectedLayout,
    closeDialog,
  } = props;
  const [courseFilter, setCourseFilter] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<string>();
  const [availableLayouts, setAvailableLayouts] = useState<
    Course[] | undefined
  >(undefined);
  const courseSelected = (courseName: string) => {
    if (!props.courses) return;
    setSelectedCourse(courseName);
    const layouts = props.courses.find((c) => c[0] === courseName);
    if (!layouts || layouts[1].length === 0) return;
    layouts && setAvailableLayouts(layouts[1]);
    layouts && setSelectedLayout(layouts[1][0]);
  };
  const layoutSelected = (courseId: string) => {
    const layout =
      availableLayouts && availableLayouts.find((l) => l.id === courseId);
    layout && setSelectedLayout(layout);
  };

  const [position, setPosition] = useState<Coordinates | undefined>(undefined);

  useMountEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (r) => {
          setPosition({
            latitude: r.coords.latitude,
            longitude: r.coords.longitude,
          });
        },
        (err) => console.log(err)
      );
    }
  });

  useEffect(() => {
    if (courseFilter.length > 2) {
      fetchCourses(courseFilter);
    } else if (position) {
      fetchCourses("", position);
    }
  }, [courseFilter, fetchCourses, position]);

  //   var chunks = chunkArray(currentCourse.holes, 6, setEditHole);

  const courses = props.courses?.slice(0, 5);

  return (
    <div>
      <CoursesMap
        coursesAvailable={courses?.map((c) => c[1][0])}
        currentPosition={position}
        selectedCourse={
          availableLayouts && availableLayouts.length > 0
            ? availableLayouts[0]
            : undefined
        }
      />
      {selectedCourse ? (
        <div className="is-flex">
          <div className="is-flex ml-2">
            <span
              onClick={() => {
                setSelectedCourse(undefined);
                setAvailableLayouts(undefined);
              }}
              className="tag is-large mb-2"
            >
              {selectedCourse}
              <button className="delete ml-3"></button>
            </span>
          </div>
          <div className="is-flex ml-2">
            <Link
              to="/courses"
              className="button px-1"
              style={{ backgroundColor: colors.button }}
              onClick={() => closeDialog()}
            >
              New Layout
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="is-flex is-flex-direction-row is-justify-content-space-around is-align-content-space-around">
            <div className="field is-flex">
              <div className="control has-icons-left">
                <input
                  className="input"
                  type="text"
                  placeholder="Course name"
                  onChange={(e) => {
                    setCourseFilter(e.target.value);
                  }}
                  style={{ backgroundColor: colors.field }}
                />
                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true"></i>
                </span>
              </div>
            </div>
            <div className="is-flex ml-2">
              <Link
                to="/courses"
                className="button px-1"
                style={{ backgroundColor: colors.button }}
                onClick={() => closeDialog()}
              >
                New Course
              </Link>
            </div>
          </div>
          <div className="panel">
            {courses &&
              courses.map((c) => (
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
                  {c[0]}{" "}
                  <span className="is-size-7">
                    - {c[1][0].distance.toFixed(0)} meters
                  </span>
                </span>
              ))}
          </div>
        </>
      )}
      {availableLayouts && availableLayouts.length > 0 && (
        <div>
          {availableLayouts.map((l) => (
            <div
              className="box py-1 mb-2 px-3"
              key={l.id}
              style={{
                backgroundColor: colors.background,
                border: selectedLayout?.id === l.id ? "3px solid black" : "",
              }}
              onClick={() => layoutSelected(l.id)}
            >
              <h2 className="subtitle has-text-weight-bold is-6 mb-1">
                {l.layout}
              </h2>
              {chunkArray(l.holes, 9).map((c, i) => {
                return (
                  <table
                    key={i}
                    className="table is-narrower is-bordered py-0 my-1 is-fullwidth"
                    style={{ backgroundColor: colors.table }}
                  >
                    <thead>
                      <tr>
                        <th>Hole</th>
                        {c.map((t, i) => t.header(i))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th>Par</th>
                        {c.map((t, i) => t.par(i))}
                      </tr>
                    </tbody>
                  </table>
                );
              })}
              {l.courseStats?.roundsOnCourse ? (
                <span className="is-size-7 is-italic">
                  {l.courseStats.roundsOnCourse} rounds on this layout,
                  previously at{" "}
                  {new Date(l.courseStats.previousRound).toLocaleDateString()}
                </span>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default connector(CourseSelector);
