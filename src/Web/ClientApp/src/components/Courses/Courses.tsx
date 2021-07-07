import React, { useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { ApplicationState } from "../../store";
import * as CoursesStore from "../../store/Courses";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { Course } from "../../store/Courses";
import CourseComponent from "./CourseComponent";
import NewCourse from "./NewCourse";

const mapState = (state: ApplicationState) => {
  return {
    courses: state.courses?.courses || [],
  };
};

const connector = connect(mapState, CoursesStore.actionCreators);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {};

const renderCoursesList = (
  layouts: Course[],
  fetchCourses: (filter: string) => void
) => {
  const onlyUnique = (value: any, index: any, self: any) => {
    return self.indexOf(value) === index;
  };
  var courseNames = layouts.map((l) => l.name).filter(onlyUnique);
  return (
    <>
      <NewCourse />
      <br />
      <br />
      <div className="field">
        <div className="control has-icons-left">
          <input
            className="input"
            type="text"
            placeholder="Search"
            onChange={(e) => {
              const filter = e.target.value;
              (filter.length > 2 || filter.length === 0) &&
                fetchCourses(filter);
            }}
          />
          <span className="icon is-left">
            <i className="fas fa-search" aria-hidden="true"></i>
          </span>
        </div>
      </div>
      <hr />
      <div className="panel">
        {courseNames &&
          courseNames.map((c) => (
            <Link key={c} to={`/courses/${c}`} className="panel-block">
              {c}
            </Link>
          ))}
      </div>
    </>
  );
};

const CoursesComponent = (props: Props) => {
  const { fetchCourses } = props;
  let { courseName } = useParams<{ courseName: string }>();
  useEffect(() => {
    fetchCourses("");
  }, [fetchCourses]);

  const layouts = props.courses.find((c) => c[0] === courseName);
  const courses = props.courses.map((x) => x[1]);

  return (
    <>
      <section className="section has-text-centered pt-0">
        {layouts && (
          <CourseComponent
            layouts={layouts[1]}
            updateCourse={props.updateCourse}
          />
        )}
        {!courseName &&
          renderCoursesList(([] as Course[]).concat(...courses), fetchCourses)}
      </section>
    </>
  );
};

export default connector(CoursesComponent);
