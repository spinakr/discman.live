import { Action, Reducer } from "redux";
import { AppThunkAction } from "./";
import { push, CallHistoryMethodAction } from "connected-react-router";

export interface User {
  username: string;
  token: string;
}

export interface LoginState {
  loggedIn: boolean;
  user: User | null;
}

export interface LoginSuccessAction {
  type: "LOGIN_SUCCEED";
  user: User;
}
export interface LoginFailedAction {
  type: "LOGIN_FAILED";
  errorMessage: string;
}

export type KnownAction =
  | CallHistoryMethodAction
  | LoginSuccessAction
  | LoginFailedAction;

let user: User | null = null;
const userString = localStorage.getItem("user");
if (userString) {
  user = JSON.parse(userString);
}
const initialState: LoginState = user
  ? { loggedIn: true, user }
  : { loggedIn: false, user: null };

export const actionCreators = {
  requestLogin: (
    username: string,
    password: string
  ): AppThunkAction<KnownAction> => (dispatch, getState) => {
    const appState = getState();
    fetch(`api/users/authenticate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => response.json() as Promise<User>)
      .then((data) => {
        dispatch({
          type: "LOGIN_SUCCEED",
          user: data,
        });
        localStorage.setItem("user", JSON.stringify(data));
      });
  },
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

export const reducer: Reducer<LoginState> = (
  state: LoginState | undefined,
  incomingAction: Action
): LoginState => {
  if (state === undefined) {
    return initialState;
  }

  const action = incomingAction as KnownAction;
  switch (action.type) {
    case "LOGIN_SUCCEED":
      return { ...state, loggedIn: true, user: action.user };
    case "LOGIN_FAILED":
      return { ...state, loggedIn: false };
    default:
      return state;
  }
};
