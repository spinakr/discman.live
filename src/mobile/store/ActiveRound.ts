import { round } from "react-native-reanimated";
import { Action, Reducer } from "redux";
import {  AppStateForegroundAction, AppThunkAction } from ".";
import urls from "../constants/Urls";
import { LoginSuccessAction, User } from "./User";

export interface Hole {
  number: number;
  par: number;
  distance: number;
  rating: number;
  average: number;
}
export interface StrokeSpec {
  outcome: StrokeOutcome;
  putDistance: number;
}

export type StrokeOutcome = "Fairway" | "Rough" | "OB" | "Circle2" | "Circle1" | "Basket";

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
  roundsPlayed: number;
  holeStats: HoleStats[];
}

export interface HoleStats {
  holeNumber: number;
  bestScore: number;
  averageScore: number;
  birdie: boolean;
  birdies: number;
  pars: number;
  worseThanPar: number;
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
  courseLayout: string;
  roundName: string;
  createdBy: string;
  startTime: string;
  completedAt: string;
  roundDuration: number;
  isCompleted: boolean;
  playerScores: PlayerScore[];
  achievements: UserAchievement[];
}

export interface ActiveRoundState {
  round: Round | null;
  activeHoleIndex: number;
  playerCourseStats: PlayerCourseStats[] | null;
  scoreCardOpen: boolean;
  username: string;
}

export interface UserAchievement {
  achievementName: string;
  username: string;
  achievedAt: Date;
  roundId: string;
}

export interface FetchRoundSuccessAction {
  type: "FETCH_ROUND_SUCCEED";
  round: Round;
}
export interface RoundWasUpdatedAction {
  type: "ROUND_WAS_UPDATED";
  round: Round;
}

export interface RoundWasCompletedAction {
  type: "ROUND_WAS_COMPLETED";
}

export interface RoundWasCreatedAction {
  type: "ROUND_WAS_CREATED";
  round: Round;
}

export interface RoundWasDeletedAction {
  type: "ROUND_WAS_DELETED";
  roundId: string;
}

export interface SetActiveHoleAction {
  type: "ACTIVE_HOLE_WAS_SET";
  holeIndex: number;
}

export interface RoundNotFoundAction {
  type: "ROUND_WAS_NOT_FOUND";
}
export interface PlayerCourseStatsFethSuceed {
  type: "FETCH_COURSE_STATS_SUCCEED";
  stats: PlayerCourseStats[];
}

export type KnownAction =
  | FetchRoundSuccessAction
  | RoundWasUpdatedAction
  | AppStateForegroundAction
  | RoundWasCreatedAction
  | RoundWasDeletedAction
  | RoundNotFoundAction
  | SetActiveHoleAction
  | RoundWasCompletedAction
  | LoginSuccessAction
  | PlayerCourseStatsFethSuceed;

const fetchRound = (roundId: string, user: User, dispatch: (action: KnownAction) => void) => {
  fetch(`${urls.discmanWebBaseUrl}/api/rounds/${roundId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user.token}`,
    },
  })
    .then((res) => {
      if (res.status === 401) {
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
    })
    .catch(() => {});
};

const countScore = (strokes: StrokeOutcome[]) => {
  const obs = strokes.filter((s) => s === "OB").length;
  return obs === 0 ? strokes.length : strokes.length + obs;
};

export const actionCreators = {
  newRound: (
    courseId: string | undefined,
    players: string[],
    roundName?: string | undefined,
  ): AppThunkAction<KnownAction> => (dispatch, getState) => {
    const appState = getState();
    if (!appState.user || !appState.user.loggedIn || !appState.user.user)
      return;
    const username = appState.user.user.username;
    if (!players.some((p) => p === username)) {
      players = [...players, username];
    }
    fetch(`${urls.discmanWebBaseUrl}/api/rounds`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${appState.user.user.token}`,
      },
      body: JSON.stringify({
        courseId: courseId,
        players: players,
        roundName,
        scoreMode: ScoreMode.DetailedLive,
      }),
    })
      .then((response) => {
        if (!response.ok) throw new Error(`${response.status} - ${response.statusText}`);
        return response.json() as Promise<Round>;
      })
      .then((data) => {
        dispatch({
          type: "ROUND_WAS_CREATED",
          round: data,
        });
      })
      .catch((err: Error) => {
      });
  },

  roundWasCreated: (round: Round) => {
    return { type: "ROUND_WAS_CREATED", round: round };
  },
  roundWasDeleted: (roundId: string) => {
    return { type: "ROUND_WAS_DELETED", roundId: roundId };
  },
  roundWasUpdated: (round: Round) => {
    return { type: "ROUND_WAS_UPDATED", round: round };
  },
  fetchStatsOnCourse: (roundId: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
    const appState = getState();
    if (!appState.user || !appState.user.loggedIn || !appState.user.user) return;
    fetch(`${urls.discmanWebBaseUrl}/api/rounds/${roundId}/courseStats`, {
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
      .then((response) => response.json() as Promise<PlayerCourseStats[]>)
      .then((data) => {
        dispatch({
          type: "FETCH_COURSE_STATS_SUCCEED",
          stats: data,
        });
      })
      .catch(() => {});
  },
  goToNextHole: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
    const state = getState();
    const courseHoles = state.activeRound?.round?.playerScores[0];
    if (!courseHoles || !state.activeRound) return;
    const currentIndex = state.activeRound.activeHoleIndex;
    const max = courseHoles.scores.length - 1;
    const nextIndex = currentIndex + 1;
    if (nextIndex > max) return;

    dispatch({ type: "ACTIVE_HOLE_WAS_SET", holeIndex: nextIndex });
  },
  goToPreviousHole: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
    const state = getState();
    const courseHoles = state.activeRound?.round?.playerScores[0];
    if (!courseHoles || !state.activeRound) return;
    const currentIndex = state.activeRound.activeHoleIndex;
    const nextIndex = currentIndex - 1;
    if (nextIndex < 0) return;

    dispatch({ type: "ACTIVE_HOLE_WAS_SET", holeIndex: nextIndex });
  },
  fetchRound: (roundId: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
    const appState = getState();
    if (!appState.user || !appState.user.loggedIn || !appState.user.user) return;
    fetchRound(roundId, appState.user.user, dispatch);
  },
  setScore: (strokes: StrokeOutcome[], putDistance?: number): AppThunkAction<KnownAction> => (dispatch, getState) => {
    const appState = getState();
    const loggedInUser = appState?.user?.user;

    const round = appState.activeRound?.round;
    const holeIndex = appState.activeRound?.activeHoleIndex;
    if (!loggedInUser || !round || holeIndex === undefined || holeIndex < 0) return;
    const playerScores = round.playerScores.find((p) => p.playerName === loggedInUser.username);
    const holeScore = playerScores && playerScores.scores[holeIndex];
    const score = countScore(strokes);

    fetch(`${urls.discmanWebBaseUrl}/api/rounds/${round.id}/scores`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${loggedInUser.token}`,
      },
      body: JSON.stringify({
        hole: holeScore?.hole.number,
        strokes: score,
        strokeOutcomes: strokes,
        username: loggedInUser.username,
        putDistance: putDistance,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          dispatch({
            type: "ROUND_WAS_NOT_FOUND",
          });
          throw new Error(`${res.status} - ${res.statusText}`);
        }
        return res;
      })
      .then((response) => response.json() as Promise<Round>)
      .then((data) => {
        dispatch({
          type: "ROUND_WAS_UPDATED",
          round: data,
        });
      })
      .catch(() => {});
  },
  completeRound: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
    const appState = getState();
    const loggedInUser = appState?.user?.user;

    const roundId = appState.activeRound?.round?.id;
    const hole = appState.activeRound?.activeHoleIndex;
    if (!loggedInUser || !roundId || !hole || hole < 1) return;

    fetch(`${urls.discmanWebBaseUrl}/api/rounds/${roundId}/complete`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${loggedInUser.token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`${res.status} - ${res.statusText}`);
        return res;
      })
      .then((response) => {
        if (response.ok) {
          dispatch({ type: "ROUND_WAS_COMPLETED" });
          
        }
      })
      .catch((err: Error) => {
      });
  },
};

const initialState: ActiveRoundState = {
  round: null,
  activeHoleIndex: 0,
  playerCourseStats: null,
  scoreCardOpen: false,
  username: ""
};

export const getActiveHole = (round: Round, user: string) => {
  const activeHole = round.playerScores.find(p => p.playerName == user)?.scores.find(s => s.strokes === 0);
  const activeHoleIndex = activeHole && round.playerScores[0].scores.findIndex((x) => x.hole.number === activeHole.hole.number);
  return activeHoleIndex !== undefined ? activeHoleIndex : round.playerScores[0].scores.length - 1;
};

export const reducer: Reducer<ActiveRoundState> = (state: ActiveRoundState | undefined, incomingAction: Action): ActiveRoundState => {
  if (state === undefined) {
    return initialState;
  }
  const action = incomingAction as KnownAction;
  switch (action.type) {
    case "FETCH_ROUND_SUCCEED":
      return {
        ...state,
        round: action.round,
        activeHoleIndex: getActiveHole(action.round, state.username),
        username: state.username
      };
    case "ROUND_WAS_UPDATED":
      if (state.round?.id !== action.round.id) return state;
      return {
        ...state,
        round: action.round,
        //if holes has been shifted on the server, the activeHoleIndex is no longer valid
        activeHoleIndex:
          action.round.playerScores[0].scores[0].hole.number !== state.round.playerScores[0].scores[0].hole.number
            ? getActiveHole(action.round, state.username) - 1
            : state.activeHoleIndex,
      };
    case "ACTIVE_HOLE_WAS_SET":
      return { ...state, activeHoleIndex: action.holeIndex };
    case "ROUND_WAS_NOT_FOUND":
      return initialState;
    case "ROUND_WAS_CREATED":
      return { ...state, round: action.round };
    case "ROUND_WAS_DELETED":
      if (state.round?.id === action.roundId) {
        return initialState;
      }
      return state;
    case "LOGIN_SUCCEED":
      return {...state, username: action.user.username}
    case "FETCH_COURSE_STATS_SUCCEED":
      return {
        ...state,
        playerCourseStats: action.stats,
      };
    case "ROUND_WAS_COMPLETED":
      return state.round ? {...state, round: {...state.round, isCompleted: true}} : state;
    case "APPSTATE_FORGROUND":
      return { ...state };
    default:
      return state;
  }
};
