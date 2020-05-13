import { Action, Reducer } from "redux";
import { AppThunkAction } from "./";
import { CallHistoryMethodAction } from "connected-react-router";
import { Hole } from "./Rounds";
import Courses from "../components/Courses/Courses";

export interface Course {
  id: string;
  name: string;
  holes: Hole[];
}

export interface CoursesState {
  courses: Course[];
}

//Actions
export interface FetchCoursesSuccessAction {
  type: "FETCH_COURSES_SUCCEED";
  courses: Course[];
}

export interface UpdateCourseSuccessAction {
  type: "COURSE_UPDATED_SUCCEED";
  course: Course;
}

export type KnownAction =
  | FetchCoursesSuccessAction
  | CallHistoryMethodAction
  | UpdateCourseSuccessAction;

const initialState: CoursesState = { courses: [] };

export const actionCreators = {
  fetchCourses: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
    const appState = getState();
    if (!appState.login || !appState.login.loggedIn || !appState.login.user)
      return;
    fetch(`api/courses`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${appState.login.user.token}`,
      },
    })
      .then((response) => response.json() as Promise<Course[]>)
      .then((data) => {
        dispatch({
          type: "FETCH_COURSES_SUCCEED",
          courses: data,
        });
      });
  },
  updateCourse: (course: Course): AppThunkAction<KnownAction> => (
    dispatch,
    getState
  ) => {
    const appState = getState();
    if (!appState.login || !appState.login.loggedIn || !appState.login.user)
      return;
    fetch(`api/courses/${course.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${appState.login.user.token}`,
      },
      body: JSON.stringify({
        holePars: course.holes.map((h) => h.par),
        holeDistances: course.holes.map((h) => h.distance),
      }),
    })
      .then((response) => response.json() as Promise<Course>)
      .then((data) => {
        dispatch({
          type: "COURSE_UPDATED_SUCCEED",
          course: data,
        });
      });
  },
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

export const reducer: Reducer<CoursesState> = (
  state: CoursesState | undefined,
  incomingAction: Action
): CoursesState => {
  if (state === undefined) {
    return initialState;
  }

  const action = incomingAction as KnownAction;
  switch (action.type) {
    case "FETCH_COURSES_SUCCEED":
      return { ...state, courses: action.courses };
    case "COURSE_UPDATED_SUCCEED":
      return {
        ...state,
        courses: [
          ...state.courses.filter((c) => c.id !== action.course.id),
          action.course,
        ],
      };
    default:
      return state;
  }
};
