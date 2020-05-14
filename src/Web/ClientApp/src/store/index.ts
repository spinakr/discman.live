import * as User from "./User";
import * as Rounds from "./Rounds";
import * as Courses from "./Courses";

// The top-level state object
export interface ApplicationState {
  user: User.UserState | undefined;
  rounds: Rounds.RoundsState | undefined;
  courses: Courses.CoursesState | undefined;
  router: any;
}

export const reducers = {
  user: User.reducer,
  rounds: Rounds.reducer,
  courses: Courses.reducer,
};

export interface AppThunkAction<TAction> {
  (dispatch: (action: TAction) => void, getState: () => ApplicationState): void;
}
