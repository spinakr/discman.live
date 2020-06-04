import { Action, Reducer } from "redux";
import { AppThunkAction } from ".";
import { actionCreators as notificationActions } from "./Notifications";

export interface LeaderboardUser {
  username: string;
  averageHoleScore: number;
  roundCount: number;
}

export interface HallOfFameEntry {
  username: string;
  timeOfEntry: Date;
  daysInHallOfFame: number;
  newThisMonth: boolean;
}

export interface MostBirdies extends HallOfFameEntry {
  count: number;
  perRound: number;
}
export interface MostBogies extends HallOfFameEntry {
  count: number;
  perRound: number;
}

export interface MostRounds extends HallOfFameEntry {
  count: number;
}

export interface BestRoundAverage extends HallOfFameEntry {
  roundAverage: number;
}

export interface HallOfFame {
  mostBirdies: MostBirdies;
  mostBogies: MostBogies;
  mostRounds: MostRounds;
  bestRoundAverage: BestRoundAverage;
}

export interface LeaderboardState {
  players: LeaderboardUser[];
  hallOfFame: HallOfFame;
}

export interface FeetchLEaderboardSuccessAction {
  type: "FETCH_LEADERBOARD_SUCCESS";
  players: LeaderboardUser[];
}

export interface FetchHallOfFameSuccessAction {
  type: "FETCH_HALLOFFAME_SUCCESS";
  hallOfFame: HallOfFame;
}

export type KnownAction =
  | FeetchLEaderboardSuccessAction
  | FetchHallOfFameSuccessAction;

const initialState: LeaderboardState = {
  players: [],
  hallOfFame: {} as HallOfFame,
};

export const actionCreators = {
  fetchHallOfFame: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
    const appState = getState();
    if (!appState.user || !appState.user.loggedIn || !appState.user.user)
      return;
    fetch(`api/leaderboard/hallOfFame`, {
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
      .then((response) => response.json() as Promise<HallOfFame>)
      .then((data) => {
        dispatch({
          type: "FETCH_HALLOFFAME_SUCCESS",
          hallOfFame: data,
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
  fetchLeaderboard: (month: number = 0): AppThunkAction<KnownAction> => (
    dispatch,
    getState
  ) => {
    const appState = getState();
    if (!appState.user || !appState.user.loggedIn || !appState.user.user)
      return;
    fetch(`api/leaderboard?month=${month}`, {
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
    case "FETCH_HALLOFFAME_SUCCESS":
      return { ...state, hallOfFame: action.hallOfFame };
    default:
      return state;
  }
};
