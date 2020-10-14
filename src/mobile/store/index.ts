import * as User from "./User";
import * as ActiveRound from "./ActiveRound";

export interface AppStateForegroundAction {
  type: "APPSTATE_FORGROUND";
}

// The top-level state object
export interface ApplicationState {
  user: User.UserState | undefined;
  activeRound: ActiveRound.ActiveRoundState | undefined;
}

export const reducers = {
  user: User.reducer,
  activeRound: ActiveRound.reducer,
};

export interface AppThunkAction<TAction> {
  (dispatch: (action: TAction) => void, getState: () => ApplicationState): void;
}
