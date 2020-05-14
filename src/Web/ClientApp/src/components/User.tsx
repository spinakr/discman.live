import React, { useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { ApplicationState } from "../store";
import * as CoursesStore from "../store/Courses";
import { useParams } from "react-router";

const mapState = (state: ApplicationState) => {
  return {
    user: state.user,
    courses: state.courses?.courses || [],
  };
};

const connector = connect(mapState, CoursesStore.actionCreators);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {};

const UserComponent = (props: Props) => {
  const { fetchCourses } = props;
  let { courseId } = useParams();
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const course = props.courses.find((c) => c.id === courseId);

  return <div></div>;
};

export default connector(UserComponent);
