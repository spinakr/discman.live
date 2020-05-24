import { Action, Reducer } from "redux";
import { AppThunkAction } from ".";
import { actionCreators as notificationActions } from "./Notifications";

export interface LeaderboardUser {
  username: string;
  averageHoleScore: number;
  roundCount: number;
}

export interface LeaderboardState {
  players: LeaderboardUser[];
}

export interface FeetchLEaderboardSuccessAction {
  type: "FETCH_LEADERBOARD_SUCCESS";
  players: LeaderboardUser[];
}

export type KnownAction = FeetchLEaderboardSuccessAction;

const initialState: LeaderboardState = { players: [] };

export const actionCreators = {
  fetchLeaderboard: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
    const appState = getState();
    if (!appState.user || !appState.user.loggedIn || !appState.user.user)
      return;
    fetch(`api/leaderboard`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${appState.user.user.token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`${res.status} - ${res.statusText}`);
        return res;
      })
      .then((response) => response.json() as Promise<LeaderboardUser[]>)
      .then((data) => {
        dispatch({
          type: "FETCH_LEADERBOARD_SUCCESS",
          players: data,
        });
      })
      .catch((err: Error) => {
        notificationActions.showNotification(
          `Fetch courses failed: ${err.message}`,
          "error",
          dispatch
        );
      });
  },
};

export const reducer: Reducer<LeaderboardState> = (
  state: LeaderboardState | undefined,
  incomingAction: Action
): LeaderboardState => {
  if (state === undefined) {
    return initialState;
  }

  const action = incomingAction as KnownAction;
  switch (action.type) {
    case "FETCH_LEADERBOARD_SUCCESS":
      return { ...state, players: action.players };
    default:
      return state;
  }
};
