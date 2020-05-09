import { Action, Reducer } from "redux";
import { AppThunkAction } from "./";
import { push, CallHistoryMethodAction } from "connected-react-router";
import { Course } from "./Courses";

export interface Hole {
  number: number;
  par: number;
}

export type StrokeOutcome =
  | "Fairway"
  | "Rough"
  | "OB"
  | "Circle2"
  | "Circle1"
  | "Basket";

export interface PlayerScore {
  playerName: string;
  scores: HoleScore[];
}

export interface HoleScore {
  hole: Hole;
  strokes: number;
  relativeToPar: number;
  outcoke: StrokeOutcome;
}

export interface Round {
  id: string;
  courseName: string;
  startTime: string;
  isCompleted: boolean;
  playerScores: PlayerScore[];
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

export interface RoundWasCompletedAction {
  type: "ROUND_WAS_COMPLETED";
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
  | SetActiveHoleAction
  | RoundWasCompletedAction;

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
      .then((response) => {
        if (response.status === 409) {
          window.alert(
            "A round with you in it was just started, redirecting to that round"
          );
        }
        return response.json() as Promise<Round>;
      })
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

    const round = appState.rounds?.round;
    const hole = appState.rounds?.activeHole;
    if (!loggedInUser || !round || !hole || hole < 1) return;

    const playerScores = round.playerScores.find(
      (p) => p.playerName === loggedInUser.username
    );
    const holeScore =
      playerScores && playerScores.scores.find((s) => s.hole.number === hole);
    if (holeScore && holeScore.strokes !== 0) {
      const goOn = window.confirm(
        "You are overwriting an existing score, continue?"
      );
      if (!goOn) return;
    }

    fetch(`api/rounds/${round.id}/scores`, {
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
  completeRound: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
    const appState = getState();
    const loggedInUser = appState?.login?.user;

    const roundId = appState.rounds?.round?.id;
    const hole = appState.rounds?.activeHole;
    if (!loggedInUser || !roundId || !hole || hole < 1) return;

    fetch(`api/rounds/${roundId}/complete`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${loggedInUser.token}`,
      },
    }).then((response) => {
      if (response.ok) dispatch({ type: "ROUND_WAS_COMPLETED" });
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
  const activeHole = round.playerScores
    .map((p) => p.scores.find((s) => s.strokes === 0))
    .sort((a, b) => {
      return a && b ? a.hole.number - b.hole.number : 0;
    })
    .find(() => true);

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
      if (state.round?.id !== action.round.id) return state;
      return {
        ...state,
        round: action.round,
        activeHole: getActiveHolde(action.round),
      };
    case "ROUND_WAS_COMPLETED":
      if (!state.round) return state;
      return {
        ...state,
        round: { ...state.round, isCompleted: true },
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
