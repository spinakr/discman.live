import { Action, Reducer } from "redux";
import { AppThunkAction } from "./";

export interface Hole {
  number: number;
  par: number;
}

export interface Score {
  player: string;
  strokes: number;
  relativeToPar: number;
}

export interface HoleScore {
  hole: Hole;
  scores: Score[];
}

export interface Round {
  id: string;
  courseName: string;
  startTime: Date;
  players: string[];
  scores: HoleScore[];
}

export interface RoundsState {
  rounds: Round[];
}

export interface FetchRoundsSuccessAction {
  type: "FETCH_ROUNDS_SUCCEED";
  rounds: Round[];
}

export type KnownAction = FetchRoundsSuccessAction;

const initialState: RoundsState = { rounds: [] };

export const actionCreators = {
  fetchLast5Rounds: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
    const appState = getState();
    if (!appState.login || !appState.login.loggedIn || !appState.login.user)
      return;
    const username = appState.login.user.username;
    fetch(`api/rounds/${username}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${appState.login.user.token}`,
      },
    })
      .then((response) => response.json() as Promise<Round[]>)
      .then((data) => {
        dispatch({
          type: "FETCH_ROUNDS_SUCCEED",
          rounds: data,
        });
      });
  },
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

export const reducer: Reducer<RoundsState> = (
  state: RoundsState | undefined,
  incomingAction: Action
): RoundsState => {
  if (state === undefined) {
    return initialState;
  }

  const action = incomingAction as KnownAction;
  switch (action.type) {
    case "FETCH_ROUNDS_SUCCEED":
      return { ...state, rounds: action.rounds };
    default:
      return state;
  }
};
