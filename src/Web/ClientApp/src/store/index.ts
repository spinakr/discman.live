import * as User from "./User";
import * as Rounds from "./Rounds";
import * as Courses from "./Courses";
import * as Notifications from "./Notifications";
import * as Leaderboard from "./Leaderboard";
import * as Tournaments from "./Tournaments";

// The top-level state object
export interface ApplicationState {
  user: User.UserState | undefined;
  rounds: Rounds.RoundsState | undefined;
  courses: Courses.CoursesState | undefined;
  notifications: Notifications.NotificationState | undefined;
  leaderboard: Leaderboard.LeaderboardState | undefined;
  tournaments: Tournaments.TournamentsState | undefined;
  router: any;
}

export const reducers = {
  user: User.reducer,
  rounds: Rounds.reducer,
  courses: Courses.reducer,
  notifications: Notifications.reducer,
  leaderboard: Leaderboard.reducer,
  tournaments: Tournaments.reducer,
};

export interface AppThunkAction<TAction> {
  (dispatch: (action: TAction) => void, getState: () => ApplicationState): void;
}
