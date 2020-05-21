import React, { useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { ApplicationState } from "../../store";
import * as CoursesStore from "../../store/Courses";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { Course } from "../../store/Courses";
import CourseDetails from "./CourseDetails";
import NewCourse from "./NewCourse";

const mapState = (state: ApplicationState) => {
  return {
    courses: state.courses?.courses || [],
  };
};

const connector = connect(mapState, CoursesStore.actionCreators);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {};

const renderCoursesList = (courses: Course[]) => {
  return (
    <section className="section">
      <NewCourse />
      <hr />
      <div className="list">
        {courses &&
          courses.map((c) => (
            <Link key={c.id} to={`/courses/${c.id}`} className="list-item">
              {c.name}
            </Link>
          ))}
      </div>
    </section>
  );
};

const CoursesComponent = (props: Props) => {
  const { fetchCourses } = props;
  let { courseId } = useParams();
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const course = props.courses.find((c) => c.id === courseId);

  return (
    <>
      {course && (
        <section className="container">
          <CourseDetails course={course} updateCourse={props.updateCourse} />
        </section>
      )}
      {!courseId && renderCoursesList(props.courses)}
    </>
  );
};

export default connector(CoursesComponent);
