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
  round: Round | null;
  activeHole: number;
}

//Actions
export interface FetchRoundsSuccessAction {
  type: "FETCH_ROUNDS_SUCCEED";
  rounds: Round[];
}

export interface FetchRoundSuccessAction {
  type: "FETCH_ROUND_SUCCEED";
  round: Round;
}

export interface ScoreUpdatedSuccessAction {
  type: "SCORE_UPDATED_SUCCESS";
  roundId: string;
}

export type KnownAction =
  | FetchRoundsSuccessAction
  | FetchRoundSuccessAction
  | ScoreUpdatedSuccessAction;

const initialState: RoundsState = { rounds: [], round: null, activeHole: 1 };

export const actionCreators = {
  fetchLast5Rounds: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
    const appState = getState();
    if (!appState.login || !appState.login.loggedIn || !appState.login.user)
      return;
    const username = appState.login.user.username;
    fetch(`api/rounds?username=${username}`, {
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
  fetchRound: (roundId: string): AppThunkAction<KnownAction> => (
    dispatch,
    getState
  ) => {
    const appState = getState();
    if (!appState.login || !appState.login.loggedIn || !appState.login.user)
      return;
    fetch(`api/rounds/${roundId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${appState.login.user.token}`,
      },
    })
      .then((response) => response.json() as Promise<Round>)
      .then((data) => {
        dispatch({
          type: "FETCH_ROUND_SUCCEED",
          round: data,
        });
      });
  },
  setScore: (score: number): AppThunkAction<KnownAction> => (
    dispatch,
    getState
  ) => {
    const appState = getState();
    const loggedInUser = appState?.login?.user;

    const roundId = appState.rounds?.round?.id;
    const hole = appState.rounds?.activeHole;
    if (!loggedInUser || !roundId) return;

    fetch(`api/rounds/${roundId}/scores`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${loggedInUser.token}`,
      },
      body: JSON.stringify({
        hole: hole,
        strokes: score,
        username: loggedInUser.username,
      }),
    })
      .then((response) => response.json() as Promise<Round>)
      .then((data) => {
        dispatch({
          type: "SCORE_UPDATED_SUCCESS",
          roundId: roundId,
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
    case "FETCH_ROUND_SUCCEED":
      const round = action.round as Round;
      const activeHole = round.scores.find((s) =>
        s.scores.some((x) => x.strokes !== 0)
      );
      return {
        ...state,
        round: action.round,
        activeHole: activeHole ? activeHole.hole.number : 1,
      };
    default:
      return state;
  }
};
