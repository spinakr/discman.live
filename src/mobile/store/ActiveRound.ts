import { AsyncStorage } from "react-native";
import { Action, Reducer } from "redux";
import { AppThunkAction } from ".";
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
  activeHole: number;
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

export type KnownAction = FetchRoundSuccessAction;

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

export const actionCreators = {
  fetchRound: (roundId: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
    const appState = getState();
    if (!appState.user || !appState.user.loggedIn || !appState.user.user) return;
    fetchRound(roundId, appState.user.user.token, dispatch);
  },
};

const initialState: ActiveRoundState = {
  round: null,
  activeHole: 1,
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

  return activeHole ? activeHole.hole.number : 100;
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
        activeHole: getActiveHole(action.round),
      };
  }
};
