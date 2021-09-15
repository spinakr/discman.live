import { Action, Reducer } from "redux";
import { AppThunkAction } from ".";
import { push, CallHistoryMethodAction } from "connected-react-router";
import { actionCreators as notificationActions } from "./Notifications";

export interface TournamentsState {
  tournaments: TournamentListing[];
  selectedTournament: Tournament | undefined;
}

export interface Tournament {
  info: TournamentInfo;
  leaderboard: TournamentLeaderboard;
  prices: Prices;
}

export interface Prices {
  scoreboard: FinalScore[];
  fastestPlayer: Price;
  slowestPlayer: Price;
  mostBirdies: Price;
  leastBogeysOrWorse: Price;
  longestCleanStreak: Price;
  longestDrySpell: Price;
  bounceBacks: Price;
}

export interface Price {
  username: string;
  scoreValue: string;
  negativePrice: boolean;
}

export interface FinalScore {
  username: string;
  score: number;
}

export interface TournamentLeaderboard {
  scores: TournamentScore[];
}

export interface TournamentScore {
  name: string;
  totalScore: number;
  totalHcpScore: number;
  coursesPlayed: string[];
}

export interface TournamentInfo {
  id: string;
  name: string;
  players: string[];
  admins: string[];
  start: Date;
  end: Date;
  courses: CourseInfo[];
  hasStarted: boolean;
  isCompleted: boolean;
}

export interface CourseInfo {
  id: string;
  name: string;
  layout: string;
}

export interface TournamentListing {
  id: string;
  name: string;
  start: Date;
  end: Date;
}
export interface TournamentCompletedSuccessAction {
  type: "TOURNAMENT_COMPLETED_SUCCESS";
  prices: Prices;
}

export interface PlayerAddedToTournamentSuccessAction {
  type: "PLAYER_ADDED_TO_TOURNAMENT_SUCCESS";
  player: string;
}

export interface FetchTournamentsSuccessAction {
  type: "FETCH_TOURNAMENTS_SUCCESS";
  tournaments: TournamentListing[];
}

export interface AddCourseToTournamentsSuccessAction {
  type: "ADD_COURSE_TO_TOURNAMENTS_SUCCESS";
  course: CourseInfo;
}

export interface FetchTournamentSuccessAction {
  type: "FETCH_TOURNAMENT_SUCCESS";
  tournament: Tournament;
}

export interface CreateTournamentsSuccessAction {
  type: "CREATE_TOURNAMENTS_SUCCESS";
  id: string;
}

export type KnownAction =
  | CallHistoryMethodAction
  | CreateTournamentsSuccessAction
  | FetchTournamentSuccessAction
  | AddCourseToTournamentsSuccessAction
  | PlayerAddedToTournamentSuccessAction
  | TournamentCompletedSuccessAction
  | FetchTournamentsSuccessAction;

const initialState: TournamentsState = {
  tournaments: [],
  selectedTournament: undefined,
};

export const actionCreators = {
  fetchTournaments: (
    onlyActive: boolean,
    username?: string
  ): AppThunkAction<KnownAction> => (dispatch, getState) => {
    const appState = getState();
    if (!appState.user || !appState.user.loggedIn || !appState.user.user)
      return;
    fetch(
      `api/tournaments?onlyActive=${onlyActive}&username=${username || ""}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${appState.user.user.token}`,
        },
      }
    )
      .then((response) => response.json() as Promise<TournamentListing[]>)
      .then((data) => {
        dispatch({
          type: "FETCH_TOURNAMENTS_SUCCESS",
          tournaments: data,
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
  fetchTournament: (id: string): AppThunkAction<KnownAction> => (
    dispatch,
    getState
  ) => {
    const appState = getState();
    if (!appState.user || !appState.user.loggedIn || !appState.user.user)
      return;
    fetch(`api/tournaments/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${appState.user.user.token}`,
      },
    })
      .then((response) => response.json() as Promise<Tournament>)
      .then((data) => {
        dispatch({
          type: "FETCH_TOURNAMENT_SUCCESS",
          tournament: data,
        });
      })
      .catch((err: Error) => {
        notificationActions.showNotification(
          `Fetch tournament failed: ${err.message}`,
          "error",
          dispatch
        );
      });
  },
  createTournament: (
    name: string,
    start: Date,
    end: Date
  ): AppThunkAction<KnownAction> => (dispatch, getState) => {
    const appState = getState();
    if (!appState.user || !appState.user.loggedIn || !appState.user.user)
      return;
    fetch(`api/tournaments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${appState.user.user.token}`,
      },
      body: JSON.stringify({
        name,
        start,
        end,
      }),
    })
      .then((response) => response.json() as Promise<string>)
      .then((data) => {
        dispatch({
          type: "CREATE_TOURNAMENTS_SUCCESS",
          id: data,
        });
        dispatch(push(`/tournaments/${data}`));
      })
      .catch((err: Error) => {
        notificationActions.showNotification(
          `Create tournament failed: ${err.message}`,
          "error",
          dispatch
        );
      });
  },
  addCourseToTournament: (
    tournamentId: string,
    courseId: string
  ): AppThunkAction<KnownAction> => (dispatch, getState) => {
    const appState = getState();
    if (!appState.user || !appState.user.loggedIn || !appState.user.user)
      return;
    fetch(`api/tournaments/${tournamentId}/courses`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${appState.user.user.token}`,
      },
      body: JSON.stringify({
        courseId,
        tournamentId,
      }),
    })
      .then((response) => response.json() as Promise<CourseInfo>)
      .then((data) => {
        dispatch({
          type: "ADD_COURSE_TO_TOURNAMENTS_SUCCESS",
          course: data,
        });
      })
      .catch((err: Error) => {
        notificationActions.showNotification(
          `Create tournament failed: ${err.message}`,
          "error",
          dispatch
        );
      });
  },
  addPlayerToTournament: (
    tournamentId: string
  ): AppThunkAction<KnownAction> => (dispatch, getState) => {
    const appState = getState();
    if (!appState.user || !appState.user.loggedIn || !appState.user.user)
      return;
    fetch(`api/tournaments/${tournamentId}/players`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${appState.user.user.token}`,
      },
      body: JSON.stringify({
        tournamentId,
      }),
    })
      .then((data) => {
        dispatch({
          type: "PLAYER_ADDED_TO_TOURNAMENT_SUCCESS",
          player: appState.user?.user?.username || "",
        });
      })
      .catch((err: Error) => {
        notificationActions.showNotification(
          `Update tournament failed: ${err.message}`,
          "error",
          dispatch
        );
      });
  },
  calculatePrices: (tournamentId: string): AppThunkAction<KnownAction> => (
    dispatch,
    getState
  ) => {
    const appState = getState();
    if (!appState.user || !appState.user.loggedIn || !appState.user.user)
      return;
    fetch(`api/tournaments/${tournamentId}/calculate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${appState.user.user.token}`,
      },
    })
      .then((response) => response.json() as Promise<Prices>)
      .then((data) => {
        dispatch({
          type: "TOURNAMENT_COMPLETED_SUCCESS",
          prices: data,
        });
      })
      .catch((err: Error) => {
        notificationActions.showNotification(
          `Complete tournament failed: ${err.message}`,
          "error",
          dispatch
        );
      });
  },
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

export const reducer: Reducer<TournamentsState> = (
  state: TournamentsState | undefined,
  incomingAction: Action
): TournamentsState => {
  if (state === undefined) {
    return initialState;
  }

  const action = incomingAction as KnownAction;
  switch (action.type) {
    case "FETCH_TOURNAMENTS_SUCCESS":
      return {
        ...state,
        tournaments: action.tournaments,
      };

    case "FETCH_TOURNAMENT_SUCCESS":
      return {
        ...state,
        selectedTournament: action.tournament,
      };
    case "TOURNAMENT_COMPLETED_SUCCESS":
      return !state.selectedTournament
        ? state
        : {
            ...state,
            selectedTournament: {
              ...state.selectedTournament,
              prices: action.prices,
            },
          };

    case "ADD_COURSE_TO_TOURNAMENTS_SUCCESS":
      return !state.selectedTournament
        ? state
        : {
            ...state,
            selectedTournament: {
              ...state.selectedTournament,
              info: {
                ...state.selectedTournament.info,
                courses: [
                  ...state.selectedTournament?.info.courses,
                  action.course,
                ],
              },
            },
          };

    case "PLAYER_ADDED_TO_TOURNAMENT_SUCCESS":
      return !state.selectedTournament
        ? state
        : {
            ...state,
            selectedTournament: {
              ...state.selectedTournament,
              info: {
                ...state.selectedTournament.info,
                players: [
                  ...state.selectedTournament?.info.players,
                  action.player,
                ],
              },
            },
          };

    case "CREATE_TOURNAMENTS_SUCCESS":
      return state;

    default:
      return state;
  }
};
