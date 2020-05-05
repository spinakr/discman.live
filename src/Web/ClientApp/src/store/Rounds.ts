import { Action, Reducer } from "redux";
import { AppThunkAction } from "./";
import { push, CallHistoryMethodAction } from "connected-react-router";
import { Course } from "./Courses";

export interface Hole {
  number: number;
  par: number;
}

export interface Score {
  player: string;
  strokes: number;
  relativeToPar: number;
  outcoke: StrokeOutcome;
}

export type StrokeOutcome =
  | "Fairway"
  | "Rough"
  | "OB"
  | "Circle2"
  | "Circle1"
  | "Basket";

export interface HoleScore {
  hole: Hole;
  scores: Score[];
}

export interface Round {
  id: string;
  courseName: string;
  startTime: string;
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

export interface NewRoundCreatedAction {
  type: "NEW_ROUND_CREATED";
  round: Round;
}

export interface RoundWasUpdatedAction {
  type: "ROUND_WAS_UPDATED";
  round: Round;
}

export interface ScoreUpdatedSuccessAction {
  type: "SCORE_UPDATED_SUCCESS";
  round: Round;
}

export interface SetActiveHoleAction {
  type: "SET_ACTIVE_HOLE";
  hole: number;
}

export interface ConnectToHubAction {
  type: "CONNECT_TO_HUB";
}

export interface DisconnectToHubAction {
  type: "DISCONNECT_TO_HUB";
}

export type KnownAction =
  | FetchRoundsSuccessAction
  | FetchRoundSuccessAction
  | ScoreUpdatedSuccessAction
  | NewRoundCreatedAction
  | CallHistoryMethodAction
  | ConnectToHubAction
  | DisconnectToHubAction
  | RoundWasUpdatedAction
  | SetActiveHoleAction;

const fetchRound = (
  roundId: string,
  token: string,
  dispatch: (action: KnownAction) => void
) => {
  fetch(`api/rounds/${roundId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json() as Promise<Round>)
    .then((data) => {
      dispatch({
        type: "FETCH_ROUND_SUCCEED",
        round: data,
      });
      dispatch({ type: "CONNECT_TO_HUB" });
    });
};

const initialState: RoundsState = { rounds: [], round: null, activeHole: 1 };

export const actionCreators = {
  roundWasUpdated: (round: Round) => {
    return { type: "ROUND_WAS_UPDATED", round: round };
  },
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
    fetchRound(roundId, appState.login.user.token, dispatch);
  },
  refreshRound: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
    const appState = getState();
    const activeRound = appState.rounds?.round?.id;
    if (!appState.login || !appState.login.loggedIn || !appState.login.user)
      return;
    activeRound && fetchRound(activeRound, appState.login.user.token, dispatch);
  },
  dissconnectHub: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
    dispatch({ type: "DISCONNECT_TO_HUB" });
  },
  newRound: (
    course: Course,
    players: string[]
  ): AppThunkAction<KnownAction> => (dispatch, getState) => {
    const appState = getState();
    if (!appState.login || !appState.login.loggedIn || !appState.login.user)
      return;
    fetch(`api/rounds`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${appState.login.user.token}`,
      },
      body: JSON.stringify({
        courseId: course.id,
        players: players,
      }),
    })
      .then((response) => response.json() as Promise<Round>)
      .then((data) => {
        dispatch({
          type: "NEW_ROUND_CREATED",
          round: data,
        });
        dispatch(push(`/rounds/${data.id}`));
      });
  },
  setScore: (
    score: number,
    strokes: StrokeOutcome[]
  ): AppThunkAction<KnownAction> => (dispatch, getState) => {
    const appState = getState();
    const loggedInUser = appState?.login?.user;

    const roundId = appState.rounds?.round?.id;
    const hole = appState.rounds?.activeHole;
    if (!loggedInUser || !roundId || !hole || hole < 1) return;

    fetch(`api/rounds/${roundId}/scores`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${loggedInUser.token}`,
      },
      body: JSON.stringify({
        hole: hole,
        strokes: score,
        strokeOutcomes: strokes,
        username: loggedInUser.username,
      }),
    })
      .then((response) => response.json() as Promise<Round>)
      .then((data) => {
        dispatch({
          type: "SCORE_UPDATED_SUCCESS",
          round: data,
        });
      });
  },
  setActiveHole: (hole: number): AppThunkAction<KnownAction> => (
    dispatch,
    getState
  ) => {
    dispatch({ type: "SET_ACTIVE_HOLE", hole: hole });
  },
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const getActiveHolde = (round: Round) => {
  const activeHole = round.scores.find((s) =>
    s.scores.some((x) => x.strokes === 0)
  );
  return activeHole ? activeHole.hole.number : 100;
};

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
      return {
        ...state,
        round: action.round,
        activeHole: getActiveHolde(action.round),
      };
    case "NEW_ROUND_CREATED":
      return { ...state, round: action.round };
    case "SCORE_UPDATED_SUCCESS":
      return {
        ...state,
        round: action.round,
        activeHole: getActiveHolde(action.round),
      };
    case "ROUND_WAS_UPDATED":
      console.log("score update from server");
      if (state.round?.id !== action.round.id) return state;
      return {
        ...state,
        round: action.round,
        activeHole: getActiveHolde(action.round),
      };
    case "SET_ACTIVE_HOLE":
      const nextHole = state.round ? getActiveHolde(state.round) : 100;
      if (action.hole > nextHole) return state;
      return {
        ...state,
        activeHole: action.hole,
      };
    default:
      return state;
  }
};
