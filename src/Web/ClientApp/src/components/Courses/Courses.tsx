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

const renderCoursesList = (layouts: Course[]) => {
  const onlyUnique = (value: any, index: any, self: any) => {
    return self.indexOf(value) === index;
  };
  var courseNames = layouts.map((l) => l.name).filter(onlyUnique);
  return (
    <>
      <NewCourse currentCourseName={""} />
      <hr />
      <div className="list">
        {courseNames &&
          courseNames.map((c) => (
            <Link key={c} to={`/courses/${c}`} className="list-item">
              {c}
            </Link>
          ))}
      </div>
    </>
  );
};

const CoursesComponent = (props: Props) => {
  const { fetchCourses } = props;
  let { courseName } = useParams();
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const layouts = props.courses.find((c) => c[0] === courseName);
  const courses = props.courses.map((x) => x[1]);

  return (
    <>
      <section className="section has-text-centered">
        {layouts && (
          <CourseComponent
            layouts={layouts[1]}
            updateCourse={props.updateCourse}
          />
        )}
        {!courseName && renderCoursesList(([] as Course[]).concat(...courses))}
      </section>
    </>
  );
};

export default connector(CoursesComponent);
