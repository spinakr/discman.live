import * as User from "./User";
import * as ActiveRound from "./ActiveRound";
import * as Courses from "./Courses";
import * as Rounds from "./Rounds";

export interface AppStateForegroundAction {
  type: "APPSTATE_FORGROUND";
}

// The top-level state object
export interface ApplicationState {
  user: User.UserState | undefined;
  activeRound: ActiveRound.ActiveRoundState | undefined;
  courses: Courses.CoursesState | undefined;
  rounds: Rounds.RoundsState | undefined;
}

export const reducers = {
  user: User.reducer,
  activeRound: ActiveRound.reducer,
  courses: Courses.reducer,
  rounds: Rounds.reducer
};

export interface AppThunkAction<TAction> {
  (dispatch: (action: TAction) => void, getState: () => ApplicationState): void;
}
