import { AsyncStorage } from "react-native";
import { Action, Reducer } from "redux";
import { AppThunkAction } from ".";
import urls from "../constants/Urls";

export interface User {
  username: string;
  token: string;
}

export interface UserDetails {
  email: string;
  simpleScoring: boolean;
  newsIdsSeen: string[];
  friends: string[];
  activeRound: string | null;
}

export interface UserState {
  loggedIn: boolean;
  user: User | null;
  userDetails: UserDetails | null;
  failedLoginMessage: string | null;
}

export interface LoginSuccessAction {
  type: "LOGIN_SUCCEED";
  user: User;
}
export interface LoginFailedAction {
  type: "LOGIN_FAILED";
  errorMessage: string;
}

export interface LogUserOutAction {
  type: "LOG_USER_OUT";
}

export interface FetchUserDetailsSuccessAction {
  type: "FETCH_USER_DETAILS_SUCCESS";
  userDetails: UserDetails;
}

export type KnownAction = LoginSuccessAction | LoginFailedAction | LogUserOutAction | FetchUserDetailsSuccessAction;

export const actionCreators = {
  requestLogin: (username: string, password: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
    fetch(`${urls.discmanWebBaseUrl}/api/users/authenticate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json() as Promise<User>;
        }
        throw new Error("No joy!");
      })
      .then((data) => {
        AsyncStorage.setItem("user", JSON.stringify(data)).then(() => {
          dispatch({
            type: "LOGIN_SUCCEED",
            user: data,
          });
        });
      })
      .catch((err: Error) => {
        dispatch({ type: "LOGIN_FAILED", errorMessage: err.message });
        setTimeout(() => {
          dispatch({ type: "LOG_USER_OUT" });
        }, 2000);
      });
  },
  fetchUserDetails: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
    const appState = getState();
    if (!appState.user || !appState.user.loggedIn || !appState.user.user) return;

    const user = appState.user.user.username;
    fetch(`api/users/details`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${appState.user.user.token}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json() as Promise<UserDetails>;
        }
        throw new Error("No joy!");
      })
      .then((data) => {
        dispatch({
          type: "FETCH_USER_DETAILS_SUCCESS",
          userDetails: data,
        });
      })
      .catch((err: Error) => {});
  },
};

const initialState: UserState = {
  loggedIn: false,
  userDetails: null,
  user: null,
  failedLoginMessage: null,
};

export const reducer: Reducer<UserState> = (state: UserState | undefined, incomingAction: Action): UserState => {
  if (state === undefined) {
    return initialState;
  }

  const action = incomingAction as KnownAction;
  switch (action.type) {
    case "LOGIN_SUCCEED":
      return {
        ...state,
        loggedIn: true,
        user: action.user,
        failedLoginMessage: null,
      };
    case "LOGIN_FAILED":
      return {
        ...state,
        loggedIn: false,
        failedLoginMessage: action.errorMessage,
      };
    case "LOG_USER_OUT":
      return {
        ...state,
        loggedIn: false,
        failedLoginMessage: null,
      };
    case "FETCH_USER_DETAILS_SUCCESS":
      return {
        ...state,
        userDetails: action.userDetails,
      };
    default:
      return state;
  }
};
