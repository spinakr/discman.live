import * as Login from "./Login";
import * as Rounds from "./Rounds";
import * as Courses from "./Courses";

// The top-level state object
export interface ApplicationState {
  login: Login.LoginState | undefined;
  rounds: Rounds.RoundsState | undefined;
  courses: Courses.CoursesState | undefined;
  router: any;
}

export const reducers = {
  login: Login.reducer,
  rounds: Rounds.reducer,
  courses: Courses.reducer,
};

export interface AppThunkAction<TAction> {
  (dispatch: (action: TAction) => void, getState: () => ApplicationState): void;
}
