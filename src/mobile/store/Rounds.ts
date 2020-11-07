import { Action, Reducer } from "redux";
import { AppThunkAction } from ".";
import { Hole, Round } from "./ActiveRound";
import urls from "../constants/Urls";

export interface PagedRounds {
  rounds: Round[];
  totalItemCount: number;
  pageNumber: number;
  pages: number;
}

export interface RoundsState {
  pageRounds: PagedRounds | null;
  rounds: Round[];
  lastPageFetched: number;
  totalPages: number;
}

//Actions
export interface FetchRoundsSuccessAction {
  type: "ROUNDS_FETCHED_SUCCESS";
  pagedRounds: PagedRounds;
}

export interface FetchMoreRoundsSuccessAction {
  type: "MORE_ROUNDS_FETCHED";
  pagedRounds: PagedRounds;
}

export type KnownAction = FetchRoundsSuccessAction | FetchMoreRoundsSuccessAction;

const initialState: RoundsState = { pageRounds: null, rounds: [], lastPageFetched: 0, totalPages: 1 };

export const actionCreators = {
  fetchMoreRounds: (
    usernameToFetch?: string
  ): AppThunkAction<KnownAction> => (dispatch, getState) => {
    const appState = getState();
    if (!appState.user || !appState.user.loggedIn || !appState.user.user || !appState.rounds)
      return;
    const prevPage= appState.rounds.lastPageFetched;
    const username = usernameToFetch || appState.user.user.username;
    
    if(appState.rounds.totalPages < prevPage + 1) return;
    fetch(`${urls.discmanWebBaseUrl}/api/rounds?username=${username}&page=${prevPage + 1}&pageSize=8`, {
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
      .then((response) => response.json() as Promise<PagedRounds>)
      .then((data) => {
        dispatch({
          type: "MORE_ROUNDS_FETCHED",
          pagedRounds: data,
        });
      })
      .catch((err: Error) => {
      });
  },
  fetchUserRounds: (
    page: number,
    usernameToFetch?: string
  ): AppThunkAction<KnownAction> => (dispatch, getState) => {
    const appState = getState();
    if (!appState.user || !appState.user.loggedIn || !appState.user.user)
      return;
    const username = usernameToFetch || appState.user.user.username;
    fetch(`${urls.discmanWebBaseUrl}/api/rounds?username=${username}&page=${page}&pageSize=8`, {
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
      .then((response) => response.json() as Promise<PagedRounds>)
      .then((data) => {
        dispatch({
          type: "ROUNDS_FETCHED_SUCCESS",
          pagedRounds: data,
        });
      })
      .catch((err: Error) => {
      });
  },
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

export const reducer: Reducer<RoundsState> = (state: RoundsState | undefined, incomingAction: Action): RoundsState => {
  if (state === undefined) {
    return initialState;
  }

  const action = incomingAction as KnownAction;
  switch (action.type) {
    case "ROUNDS_FETCHED_SUCCESS":
      return {...state, pageRounds: action.pagedRounds}
    case "MORE_ROUNDS_FETCHED":
      return {...state, lastPageFetched: state.lastPageFetched + 1, totalPages: action.pagedRounds.pages, rounds: [...state.rounds, ...action.pagedRounds.rounds]}

    default:
      return state;
  }
};
