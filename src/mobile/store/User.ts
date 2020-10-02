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
  loggingIn: boolean;
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
export interface LoginRequestedAction {
  type: "LOGIN_REQUESTED";
}

export interface LogUserOutAction {
  type: "LOGOUT_SUCCEED";
}

export interface FetchUserDetailsSuccessAction {
  type: "FETCH_USER_DETAILS_SUCCESS";
  userDetails: UserDetails;
}

export type KnownAction = LoginSuccessAction | LoginFailedAction | LogUserOutAction | FetchUserDetailsSuccessAction | LoginRequestedAction;

export const actionCreators = {
  loadLogginInfo: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
    AsyncStorage.getItem("user").then((data) => {
      if (!data) return;
      const user: User = JSON.parse(data);
      dispatch({
        type: "LOGIN_SUCCEED",
        user,
      });
    });
  },
  logout: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
    AsyncStorage.removeItem("user").then(() => {
      dispatch({
        type: "LOGOUT_SUCCEED",
      });
    });
  },
  requestLogin: (username: string, password: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
    dispatch({
      type: "LOGIN_REQUESTED",
    });
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
          dispatch({ type: "LOGOUT_SUCCEED" });
        }, 2000);
      });
  },
  fetchUserDetails: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
    const appState = getState();
    if (!appState.user || !appState.user.loggedIn || !appState.user.user) return;

    const user = appState.user.user.username;
    fetch(`${urls.discmanWebBaseUrl}/api/users/details`, {
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
      .catch((err: Error) => {
        //SDASD
      });
  },
};

const initialState: UserState = {
  loggedIn: false,
  loggingIn: false,
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
    case "LOGIN_REQUESTED":
      return {
        ...state,
        loggingIn: true,
      };
    case "LOGIN_SUCCEED":
      return {
        ...state,
        loggedIn: true,
        loggingIn: false,
        user: action.user,
        failedLoginMessage: null,
      };
    case "LOGIN_FAILED":
      return {
        ...state,
        loggedIn: false,
        loggingIn: false,
        failedLoginMessage: action.errorMessage,
      };

    case "LOGOUT_SUCCEED":
      return initialState;

    case "FETCH_USER_DETAILS_SUCCESS":
      return {
        ...state,
        userDetails: action.userDetails,
      };
    default:
      return state;
  }
};
