import { AsyncStorage } from "react-native";
import { Action, Reducer } from "redux";
import { AppThunkAction } from ".";
import urls from "../constants/Urls";
import { RoundWasCreatedAction, RoundWasDeletedAction } from "./ActiveRound";

export interface User {
  username: string;
  token: string;
}

export interface UserDetails {
  email: string;
  simpleScoring: boolean;
  registerPutDistance: boolean;
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

export interface RegisterPutDistanceSuccessAction {
  type: "REGISTERPUTDISTANCE_UPDATED_SUCCESS";
  registerPutDistance: boolean;
}

export interface LogUserOutAction {
  type: "LOGOUT_SUCCEED";
}

export interface FetchUserDetailsSuccessAction {
  type: "FETCH_USER_DETAILS_SUCCESS";
  userDetails: UserDetails;
}
export interface ConnectToHubAction {
  type: "CONNECT_TO_HUB";
}

export type KnownAction =
  | LoginSuccessAction
  | LoginFailedAction
  | LogUserOutAction
  | ConnectToHubAction
  | FetchUserDetailsSuccessAction
  | RegisterPutDistanceSuccessAction
  | LoginRequestedAction
  | RoundWasCreatedAction
  | RoundWasDeletedAction;

var fetchedUserDetails: number = 0; //concurrency controll of exesive fetching

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
  setRegisterPutDistance: (registerPutDistance: boolean): AppThunkAction<KnownAction> => (dispatch, getState) => {
    const appState = getState();
    if (!appState.user || !appState.user.loggedIn || !appState.user.user) return;
    fetch(`${urls.discmanWebBaseUrl}/api/users/registerPutDistance`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${appState.user.user.token}`,
      },
      body: JSON.stringify({ registerPutDistance }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`${res.status} - ${res.statusText}`);
        return res;
      })
      .then((data) => {
        dispatch({ type: "REGISTERPUTDISTANCE_UPDATED_SUCCESS", registerPutDistance });
      })
      .catch((err: Error) => {});
  },
  createUser: (username: string, password: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
    fetch(`${urls.discmanWebBaseUrl}/api/users`, {
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
        throw new Error("Error creating user");
      })
      .then((data) => {
        dispatch({
          type: "LOGIN_SUCCEED",
          user: data,
        });
        localStorage.setItem("user", JSON.stringify(data));
        actionCreators.fetchUserDetails()(dispatch, getState);
      })
      .catch((err: Error) => {
        dispatch({ type: "LOGIN_FAILED", errorMessage: err.message });
        setTimeout(() => {
          dispatch({ type: "LOGOUT_SUCCEED" });
        }, 2000);
      });
  },
  fetchUserDetails: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
    if (Date.now() - fetchedUserDetails < 1000) return;
    fetchedUserDetails = Date.now();
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
      .catch((err: Error) => {});
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
    case "REGISTERPUTDISTANCE_UPDATED_SUCCESS":
      return {
        ...state,
        userDetails: state.userDetails && {
          ...state.userDetails,
          registerPutDistance: action.registerPutDistance,
        },
      };
    case "ROUND_WAS_CREATED":
      return {
        ...state,
        userDetails: state.userDetails && {
          ...state.userDetails,
          activeRound: action.round.id,
        },
      };
    case "ROUND_WAS_DELETED":
      return {
        ...state,
        userDetails: state.userDetails && {
          ...state.userDetails,
          activeRound: null,
        },
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
