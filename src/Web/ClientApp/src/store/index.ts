import * as User from "./User";
import * as Rounds from "./Rounds";
import * as Courses from "./Courses";
import * as Notifications from "./Notifications";

// The top-level state object
export interface ApplicationState {
  user: User.UserState | undefined;
  rounds: Rounds.RoundsState | undefined;
  courses: Courses.CoursesState | undefined;
  notifications: Notifications.NotificationState | undefined;
  router: any;
}

export const reducers = {
  user: User.reducer,
  rounds: Rounds.reducer,
  courses: Courses.reducer,
  notifications: Notifications.reducer,
};

export interface AppThunkAction<TAction> {
  (dispatch: (action: TAction) => void, getState: () => ApplicationState): void;
}
