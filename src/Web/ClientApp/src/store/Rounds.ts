/* eslint-disable @typescript-eslint/no-use-before-define */
import { Action, Reducer } from "redux";
import { AppThunkAction } from "./";
import { push, CallHistoryMethodAction } from "connected-react-router";
import { Course } from "./Courses";
import { hub } from "./configureStore";
import * as signalR from "@microsoft/signalr";
import { actionCreators as notificationActions } from "./Notifications";
import { actionCreators as UserActions, UserAchievement } from "./User";

export interface Hole {
  number: number;
  par: number;
  distance: number;
  rating: number;
  average: number;
}
export interface StrokeSpec {
  strokeOutcome: StrokeOutcome;
}

export type StrokeOutcome =
  | "Fairway"
  | "Rough"
  | "OB"
  | "Circle2"
  | "Circle1"
  | "Basket";

export enum ScoreMode {
  DetailedLive = 0,
  StrokesLive = 1,
  OneForAll = 2,
}

export interface PlayerScore {
  playerName: string;
  scores: HoleScore[];
}

export interface PlayerCourseStats {
  courseName: string;
  layoutName: string;
  playerName: string;
  courseAverage: number;
  thisRoundVsAverage: number;
  playerCourseRecord: number;
  holeAverages: number[];
  averagePrediction: number[];
  roundsPlayed: string;
}

export interface PlayerRoundProgression {
  courseAverage: number;
  holeAverages: [number, number][];
  averagePrediction: [number, number][];
}

export interface HoleScore {
  hole: Hole;
  strokes: number;
  relativeToPar: number;
  strokeSpecs: StrokeSpec[];
}

export interface Round {
  id: string;
  courseName: string;
  roundName: string;
  createdBy: string;
  startTime: string;
  completedAt: string;
  roundDuration: number;
  isCompleted: boolean;
  scoreMode: ScoreMode;
  playerScores: PlayerScore[];
  achievements: UserAchievement[];
}

export interface RoundsState {
  rounds: Round[];
  round: Round | null;
  activeHole: number;
  playerCourseStats: PlayerCourseStats[] | null;
  scoreCardOpen: boolean;
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

export interface CourseWasSavedAction {
  type: "COURSE_WAS_SAVED";
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
export interface PlayerCourseStatsFethSuceed {
  type: "FETCH_COURSE_STATS_SUCCEED";
  stats: PlayerCourseStats[];
}

export interface ToggleScoreCardAction {
  type: "TOGGLE_SCORECARD";
  open: boolean;
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
  | RoundWasCompletedAction
  | PlayerCourseStatsFethSuceed
  | ToggleScoreCardAction
  | CourseWasSavedAction;

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
    .then((res) => {
      if (res.status === 401) {
        UserActions.logout();
      }
      if (!res.ok) throw new Error(`${res.status} - ${res.statusText}`);
      return res;
    })
    .then((response) => response.json() as Promise<Round>)
    .then((data) => {
      dispatch({
        type: "FETCH_ROUND_SUCCEED",
        round: data,
      });
      dispatch({ type: "CONNECT_TO_HUB" });
    })
    .catch((err: Error) => {
      notificationActions.showNotification(
        `Fetch rounds failed: ${err.message}`,
        "error",
        dispatch
      );
    });
};

const initialState: RoundsState = {
  rounds: [],
  round: null,
  activeHole: 1,
  playerCourseStats: null,
  scoreCardOpen: false,
};

export const actionCreators = {
  setScorecardOpen: (open: boolean): AppThunkAction<KnownAction> => (
    dispatch
  ) => {
    dispatch({ type: "TOGGLE_SCORECARD", open });
  },
  roundWasUpdated: (round: Round) => {
    return { type: "ROUND_WAS_UPDATED", round: round };
  },
  fetchLastRounds: (numberOfRounds?: number): AppThunkAction<KnownAction> => (
    dispatch,
    getState
  ) => {
    const appState = getState();
    if (!appState.user || !appState.user.loggedIn || !appState.user.user)
      return;
    const username = appState.user.user.username;
    fetch(`api/rounds?username=${username}&count=${numberOfRounds || 5}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${appState.user.user.token}`,
      },
    })
      .then((res) => {
        if (res.status === 401) {
          UserActions.logout()(dispatch);
        }
        if (!res.ok) throw new Error(`${res.status} - ${res.statusText}`);
        return res;
      })
      .then((response) => response.json() as Promise<Round[]>)
      .then((data) => {
        dispatch({
          type: "FETCH_ROUNDS_SUCCEED",
          rounds: data,
        });
      })
      .catch((err: Error) => {
        notificationActions.showNotification(
          `Fetch rounds failed: ${err.message}`,
          "error",
          dispatch
        );
      });
  },
  fetchStatsOnCourse: (roundId: string): AppThunkAction<KnownAction> => (
    dispatch,
    getState
  ) => {
    const appState = getState();
    if (!appState.user || !appState.user.loggedIn || !appState.user.user)
      return;
    fetch(`api/rounds/${roundId}/stats`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${appState.user.user.token}`,
      },
    })
      .then((res) => {
        if (res.status === 401) {
          UserActions.logout()(dispatch);
        }
        if (!res.ok) throw new Error(`${res.status} - ${res.statusText}`);
        return res;
      })
      .then((response) => response.json() as Promise<PlayerCourseStats[]>)
      .then((data) => {
        dispatch({
          type: "FETCH_COURSE_STATS_SUCCEED",
          stats: data,
        });
      })
      .catch((err: Error) => {
        notificationActions.showNotification(
          `Fetch course stats failed: ${err.message}`,
          "error",
          dispatch
        );
      });
  },
  fetchRound: (roundId: string): AppThunkAction<KnownAction> => (
    dispatch,
    getState
  ) => {
    const appState = getState();
    if (!appState.user || !appState.user.loggedIn || !appState.user.user)
      return;
    fetchRound(roundId, appState.user.user.token, dispatch);
  },
  refreshRound: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
    const appState = getState();
    const activeRound = appState.rounds?.round?.id;
    if (!appState.user || !appState.user.loggedIn || !appState.user.user)
      return;

    activeRound &&
      hub.state !== signalR.HubConnectionState.Connected &&
      fetchRound(activeRound, appState.user.user.token, dispatch);
  },
  dissconnectHub: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
    dispatch({ type: "DISCONNECT_TO_HUB" });
  },
  newRound: (
    course: Course | undefined,
    players: string[],
    roundName: string,
    scoreMode: ScoreMode
  ): AppThunkAction<KnownAction> => (dispatch, getState) => {
    const appState = getState();
    if (!appState.user || !appState.user.loggedIn || !appState.user.user)
      return;
    const username = appState.user.user.username;
    if (!players.some((p) => p === username)) {
      players = [...players, username];
    }
    fetch(`api/rounds`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${appState.user.user.token}`,
      },
      body: JSON.stringify({
        courseId: course?.id,
        players: players,
        roundName,
        scoreMode,
      }),
    })
      .then((response) => {
        if (response.status === 401) {
          UserActions.logout()(dispatch);
        }
        if (response.status === 409) {
          window.alert(
            "A round with you in it was just started, redirecting to that round"
          );
        }
        if (!response.ok && response.status !== 409)
          throw new Error(`${response.status} - ${response.statusText}`);
        return response.json() as Promise<Round>;
      })
      .then((data) => {
        dispatch({
          type: "NEW_ROUND_CREATED",
          round: data,
        });
        dispatch(push(`/rounds/${data.id}`));
      })
      .catch((err: Error) => {
        notificationActions.showNotification(
          `Create round failed: ${err.message}`,
          "error",
          dispatch
        );
      });
  },
  addHole: (
    holeNumber: number,
    par: number,
    length: number
  ): AppThunkAction<KnownAction> => (dispatch, getState) => {
    const appState = getState();
    if (!appState.user || !appState.user.loggedIn || !appState.user.user)
      return;
    const roundId = appState.rounds?.round?.id;
    fetch(`api/rounds/${roundId}/holes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${appState.user.user.token}`,
      },
      body: JSON.stringify({ holeNumber, par, length }),
    })
      .then((response) => {
        if (!response.ok)
          throw new Error(`${response.status} - ${response.statusText}`);
        return response.json() as Promise<Round>;
      })
      .then((data) => {})
      .catch((err: Error) => {
        notificationActions.showNotification(
          `Add hole failed: ${err.message}`,
          "error",
          dispatch
        );
      });
  },
  deleteRound: (roundId: string): AppThunkAction<KnownAction> => (
    dispatch,
    getState
  ) => {
    const appState = getState();
    if (!appState.user || !appState.user.loggedIn || !appState.user.user)
      return;

    fetch(`api/rounds/${roundId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${appState.user.user.token}`,
      },
    })
      .then((res) => {
        if (res.status === 401) {
          UserActions.logout()(dispatch);
        }
        if (!res.ok) throw new Error(`${res.status} - ${res.statusText}`);
        return res;
      })
      .then((response) => {
        dispatch(push("/"));
      })
      .catch((err: Error) => {
        notificationActions.showNotification(
          `Delete round failed: ${err.message}`,
          "error",
          dispatch
        );
      });
  },
  skipHole: (roundId: string): AppThunkAction<KnownAction> => (
    dispatch,
    getState
  ) => {
    const appState = getState();
    if (!appState.user || !appState.user.loggedIn || !appState.user.user)
      return;

    const holeNumber = appState.rounds?.activeHole;
    if (!holeNumber || !roundId) return;
    fetch(`api/rounds/${roundId}/holes/${holeNumber}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${appState.user.user.token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`${res.status} - ${res.statusText}`);
        return res;
      })
      .catch((err: Error) => {
        notificationActions.showNotification(
          `Delete hole failed: ${err.message}`,
          "error",
          dispatch
        );
      });
  },
  leaveRound: (roundId: string): AppThunkAction<KnownAction> => (
    dispatch,
    getState
  ) => {
    const appState = getState();
    if (!appState.user || !appState.user.loggedIn || !appState.user.user)
      return;

    if (!roundId) return;
    fetch(`api/rounds/${roundId}/users`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${appState.user.user.token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`${res.status} - ${res.statusText}`);
        return res;
      })
      .catch((err: Error) => {
        notificationActions.showNotification(
          `Leave round failed: ${err.message}`,
          "error",
          dispatch
        );
      });
  },
  setScore: (
    score: number,
    strokes: StrokeOutcome[]
  ): AppThunkAction<KnownAction> => (dispatch, getState) => {
    const appState = getState();
    const loggedInUser = appState?.user?.user;

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
      .then((res) => {
        if (res.status === 401) {
          UserActions.logout()(dispatch);
        }
        if (!res.ok) throw new Error(`${res.status} - ${res.statusText}`);
        return res;
      })
      .then((response) => response.json() as Promise<Round>)
      .then((data) => {
        dispatch({
          type: "SCORE_UPDATED_SUCCESS",
          round: data,
        });
      })
      .catch((err: Error) => {
        notificationActions.showNotification(
          `Set score failed: ${err.message}`,
          "error",
          dispatch
        );
      });
  },
  setScoringMode: (mode: ScoreMode): AppThunkAction<KnownAction> => (
    dispatch,
    getState
  ) => {
    const appState = getState();
    const loggedInUser = appState?.user?.user;
    const roundId = appState.rounds?.round?.id;
    if (!loggedInUser || !roundId) return;

    fetch(`api/rounds/${roundId}/scoremode`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${loggedInUser.token}`,
      },
      body: JSON.stringify({ scoreMode: mode }),
    })
      .then((res) => {
        if (res.status === 401) {
          UserActions.logout()(dispatch);
        }
        if (!res.ok) throw new Error(`${res.status} - ${res.statusText}`);
        return res;
      })
      .then((response) => {})
      .catch((err: Error) => {
        notificationActions.showNotification(
          `Set scoring mode failed: ${err.message}`,
          "error",
          dispatch
        );
      });
  },
  completeRound: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
    const appState = getState();
    const loggedInUser = appState?.user?.user;

    const roundId = appState.rounds?.round?.id;
    const hole = appState.rounds?.activeHole;
    if (!loggedInUser || !roundId || !hole || hole < 1) return;

    fetch(`api/rounds/${roundId}/complete`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${loggedInUser.token}`,
      },
    })
      .then((res) => {
        if (res.status === 401) {
          UserActions.logout()(dispatch);
        }
        if (!res.ok) throw new Error(`${res.status} - ${res.statusText}`);
        return res;
      })
      .then((response) => {
        if (response.ok) dispatch({ type: "ROUND_WAS_COMPLETED" });
      })
      .catch((err: Error) => {
        notificationActions.showNotification(
          `Complete round failed: ${err.message}`,
          "error",
          dispatch
        );
      });
  },
  saveAsCourse: (courseName: string): AppThunkAction<KnownAction> => (
    dispatch,
    getState
  ) => {
    const appState = getState();
    const loggedInUser = appState?.user?.user;
    const roundId = appState.rounds?.round?.id;
    if (!loggedInUser || !roundId) return;

    fetch(`api/rounds/${roundId}/savecourse`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${loggedInUser.token}`,
      },
      body: JSON.stringify({ courseName }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`${res.status} - ${res.statusText}`);
        return res;
      })
      .then((response) => {
        if (response.ok) dispatch({ type: "COURSE_WAS_SAVED" });
      })
      .catch((err: Error) => {
        notificationActions.showNotification(
          `Complete round failed: ${err.message}`,
          "error",
          dispatch
        );
      });
  },
  setActiveHole: (hole: number): AppThunkAction<KnownAction> => (dispatch) => {
    dispatch({ type: "SET_ACTIVE_HOLE", hole: hole });
  },
};

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
    case "TOGGLE_SCORECARD":
      return { ...state, scoreCardOpen: action.open };
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
    case "FETCH_COURSE_STATS_SUCCEED":
      return {
        ...state,
        playerCourseStats: action.stats,
      };
    default:
      return state;
  }
};
