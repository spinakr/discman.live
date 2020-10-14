import { AsyncStorage } from "react-native";
import { Action, Reducer } from "redux";
import { AppStateForegroundAction, AppThunkAction } from ".";
import urls from "../constants/Urls";
import { User } from "./User";

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
  roundsPlayed: string;
  holeStats: HoleStats[];
}

export interface HoleStats {
  holeNumber: number;
  bestScore: number;
  averageScore: number;
  birdie: boolean;
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
  finishedRoundStats: UserStats[];
}

export interface UserStats {
  username: string;
  roundsPlayed: number;
  holesPlayed: number;
  fairwayHitRate: number;
  scrambleRate: number;
  circle1Rate: number;
  circle2Rate: number;
  obRate: number;
  birdieRate: number;
  parRate: number;
  averageScore: number;
  strokesGained: number;
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

export interface ScoreUpdatedSuccessAction {
  type: "SCORE_UPDATED_SUCCESS";
  round: Round;
}

export type KnownAction =
  | FetchRoundSuccessAction
  | RoundWasUpdatedAction
  | AppStateForegroundAction
  | RoundWasCreatedAction
  | RoundWasDeletedAction
  | SetActiveHoleAction
  | ScoreUpdatedSuccessAction;

const fetchRound = (roundId: string, token: string, dispatch: (action: KnownAction) => void) => {
  fetch(`${urls.discmanWebBaseUrl}/api/rounds/${roundId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
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
    .catch((err: Error) => {});
};

const countScore = (strokes: StrokeOutcome[]) => {
  const obs = strokes.filter((s) => s === "OB").length;
  return obs === 0 ? strokes.length : strokes.length + obs;
};

export const actionCreators = {
  roundWasCreated: (round: Round) => {
    return { type: "ROUND_WAS_CREATED", round: round };
  },
  roundWasDeleted: (roundId: string) => {
    return { type: "ROUND_WAS_DELETED", roundId: roundId };
  },
  roundWasUpdated: (round: Round) => {
    return { type: "ROUND_WAS_UPDATED", round: round };
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
    fetchRound(roundId, appState.user.user.token, dispatch);
  },
  setScore: (strokes: StrokeOutcome[]): AppThunkAction<KnownAction> => (dispatch, getState) => {
    const appState = getState();
    const loggedInUser = appState?.user?.user;

    const round = appState.activeRound?.round;
    const holeIndex = appState.activeRound?.activeHoleIndex;
    console.log(holeIndex);
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
      }),
    })
      .then((res) => {
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
      .catch((err: Error) => {});
  },
};

const initialState: ActiveRoundState = {
  round: null,
  activeHoleIndex: 0,
  playerCourseStats: null,
  scoreCardOpen: false,
  finishedRoundStats: [],
};

const getActiveHole = (round: Round) => {
  const activeHole = round.playerScores
    .map((p) => p.scores.find((s) => s.strokes === 0))
    .sort((a, b) => {
      return a && b ? a.hole.number - b.hole.number : 0;
    })
    .find(() => true);

  const activeHoleIndex = activeHole && round.playerScores[0].scores.indexOf(activeHole);
  console.log(activeHoleIndex);

  return activeHoleIndex !== undefined ? activeHoleIndex : 100;
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
        activeHoleIndex: getActiveHole(action.round),
      };
    case "ROUND_WAS_UPDATED":
      if (state.round?.id !== action.round.id) return state;
      return {
        ...state,
        round: action.round,
        activeHoleIndex: getActiveHole(action.round),
      };
    case "ACTIVE_HOLE_WAS_SET":
      return { ...state, activeHoleIndex: action.holeIndex };
    case "SCORE_UPDATED_SUCCESS":
      return {
        ...state,
        round: action.round,
        activeHoleIndex: getActiveHole(action.round),
      };
    case "ROUND_WAS_CREATED":
      return { ...state, round: action.round };
    case "ROUND_WAS_DELETED":
      if (state.round?.id === action.roundId) {
        return initialState;
      }
      return state;

    case "APPSTATE_FORGROUND":
      return { ...state };
    default:
      return state;
  }
};
