import * as User from "./User";


// The top-level state object
export interface ApplicationState {
  user: User.UserState | undefined;
}

export const reducers = {
  user: User.reducer,
};

export interface AppThunkAction<TAction> {
  (dispatch: (action: TAction) => void, getState: () => ApplicationState): void;
}
