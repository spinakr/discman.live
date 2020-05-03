import { Action, Reducer } from "redux";
import { AppThunkAction } from "./";
import { push, CallHistoryMethodAction } from "connected-react-router";
import { Hole } from "./Rounds";

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

export type KnownAction = FetchCoursesSuccessAction | CallHistoryMethodAction;

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
    default:
      return state;
  }
};
