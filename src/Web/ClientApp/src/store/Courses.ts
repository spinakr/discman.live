import { Action, Reducer } from "redux";
import { AppThunkAction } from "./";
import { CallHistoryMethodAction } from "connected-react-router";
import { Hole } from "./Rounds";
import { actionCreators as notificationActions } from "./Notifications";
import { actionCreators as UserActions } from "./User";

export interface Course {
  id: string;
  name: string;
  layout: string;
  holes: Hole[];
  courseStats: CourseStats;
}

export interface CourseStats {
  roundsOnCourse: number;
  previousRound: Date;
}

export interface CoursesState {
  courses: [string, Course[]][];
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
export interface CourseCreatedSuccessAction {
  type: "COURSE_CREATED_SUCCEED";
  course: Course;
}

export type KnownAction =
  | FetchCoursesSuccessAction
  | CallHistoryMethodAction
  | CourseCreatedSuccessAction
  | UpdateCourseSuccessAction;

const initialState: CoursesState = { courses: [] };

export const actionCreators = {
  fetchCourses: (filter: string): AppThunkAction<KnownAction> => (
    dispatch,
    getState
  ) => {
    const appState = getState();
    if (!appState.user || !appState.user.loggedIn || !appState.user.user)
      return;
    fetch(`api/courses?filter=${filter}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${appState.user.user.token}`,
      },
    })
      .then((res) => {
        if (res.status === 401) {
          UserActions.logout()(dispatch);
        }
        if (!res.ok) throw new Error(`${res.status} - ${res.statusText}`);
        return res;
      })
      .then((response) => response.json() as Promise<Course[]>)
      .then((data) => {
        dispatch({
          type: "FETCH_COURSES_SUCCEED",
          courses: data,
        });
      })
      .catch((err: Error) => {
        notificationActions.showNotification(
          `Fetch courses failed: ${err.message}`,
          "error",
          dispatch
        );
      });
  },
  createCourse: (
    courseName: string,
    layoutName: string,
    numberOfHoles: number
  ): AppThunkAction<KnownAction> => (dispatch, getState) => {
    const appState = getState();
    if (!appState.user || !appState.user.loggedIn || !appState.user.user)
      return;
    fetch(`api/courses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${appState.user.user.token}`,
      },
      body: JSON.stringify({
        courseName,
        layoutName,
        numberOfHoles,
      }),
    })
      .then((res) => {
        if (res.status === 401) {
          UserActions.logout()(dispatch);
        }
        if (!res.ok) throw new Error(`${res.status} - ${res.statusText}`);
        return res;
      })
      .then((response) => response.json() as Promise<Course>)
      .then((data) => {
        dispatch({
          type: "COURSE_CREATED_SUCCEED",
          course: data,
        });
      })
      .catch((err: Error) => {
        notificationActions.showNotification(
          `Create courses failed: ${err.message}`,
          "error",
          dispatch
        );
      });
  },
  updateCourse: (course: Course): AppThunkAction<KnownAction> => (
    dispatch,
    getState
  ) => {
    const appState = getState();
    if (!appState.user || !appState.user.loggedIn || !appState.user.user)
      return;
    fetch(`api/courses/${course.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${appState.user.user.token}`,
      },
      body: JSON.stringify({
        holePars: course.holes.map((h) => h.par),
        holeDistances: course.holes.map((h) => h.distance),
      }),
    })
      .then((res) => {
        if (res.status === 401) {
          UserActions.logout()(dispatch);
        }
        if (!res.ok) throw new Error(`${res.status} - ${res.statusText}`);
        return res;
      })
      .then((response) => response.json() as Promise<Course>)
      .then((data) => {
        dispatch({
          type: "COURSE_UPDATED_SUCCEED",
          course: data,
        });
      })
      .catch((err: Error) => {
        notificationActions.showNotification(
          `Update courses failed: ${err.message}`,
          "error",
          dispatch
        );
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
      return {
        ...state,
        courses: action.courses.reduce((g, course: Course) => {
          const existingEl = g.find((x) => x[0] === course.name);
          if (existingEl) {
            existingEl[1].push(course);
          } else {
            g.push([course.name, [course]]);
          }

          return g;
        }, [] as [string, Course[]][]),
      };
    case "COURSE_UPDATED_SUCCEED":
      return {
        ...state,
        courses: [
          ...state.courses.map((c) => {
            const layout = c[1].find((l) => l.id === action.course.id);
            if (layout) {
              var newc: [string, Course[]] = [
                c[0],
                [
                  ...c[1].filter((x) => x.id !== action.course.id),
                  action.course,
                ],
              ];
              return newc;
            }
            return c;
          }),
        ],
      };
    case "COURSE_CREATED_SUCCEED":
      if (state.courses.some((c) => c[0] === action.course.name)) {
        return {
          ...state,
          courses: [
            ...state.courses.map((c) => {
              if (c[0] === action.course.name) {
                return [c[0], [...c[1], action.course]] as [string, Course[]];
              }
              return c;
            }),
          ],
        };
      } else {
        return {
          ...state,
          courses: [
            ...state.courses,
            [action.course.name, [action.course]] as [string, Course[]],
          ],
        };
      }

    default:
      return state;
  }
};
