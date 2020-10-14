import { Action, AnyAction, applyMiddleware, combineReducers, compose, createStore, Dispatch, Middleware, MiddlewareAPI } from "redux";
import thunk from "redux-thunk";
import { ApplicationState, reducers } from "./";
import * as signalR from "@microsoft/signalr";
import { User } from "./User";
import { AsyncStorage } from "react-native";
import { actionCreators as roundsActions, Round } from "./ActiveRound";
import { actionCreators as userActions } from "./User";
import Urls from "../constants/Urls";

const createHub = () => {
  return new signalR.HubConnectionBuilder()
    .withUrl(`${Urls.discmanWebBaseUrl}/roundHub`, {
      accessTokenFactory: async () => {
        const userToken = await AsyncStorage.getItem("user");
        if (!userToken) {
          return "";
        }
        const user: User = JSON.parse(userToken);
        var activeToken = user.token;
        return activeToken ? activeToken : "";
      },
    })
    .configureLogging(signalR.LogLevel.Debug)
    .build();
};

export let hub = createHub();

const connectHub = (dispatch: Dispatch<AnyAction>) => {
  hub.on("roundUpdated", (roundJson: string) => {
    let round: Round = JSON.parse(roundJson);
    dispatch(roundsActions.roundWasUpdated(round));
  });
  hub.on("newRoundCreated", (roundJson: string) => {
    let round: Round = JSON.parse(roundJson);
    dispatch(roundsActions.roundWasCreated(round));
  });

  hub.on("roundDeleted", (roundId: string) => {
    dispatch(roundsActions.roundWasDeleted(roundId));
  });

  hub.onclose(() => {});
  hub.start().catch((err) => {
    console.log(err);
  });
};
const socketsMiddleware: Middleware = ({ dispatch, getState }: MiddlewareAPI) => (next: Dispatch) => <A extends Action>(action: A) => {
  if (action.type === "LOGIN_SUCCEED") {
    const state: ApplicationState = getState();
    if (hub.state === signalR.HubConnectionState.Disconnected) {
      connectHub(dispatch);
    }
  }

  if (action.type === "APPSTATE_FORGROUND") {
    if (hub.state !== signalR.HubConnectionState.Disconnected) return;
    const state: ApplicationState = getState();
    if (!state.user?.loggedIn) return;
    connectHub(dispatch);
    const activeRoundId = state.activeRound?.round?.id;
    if (activeRoundId) {
      roundsActions.fetchRound(activeRoundId)(dispatch, getState);
    } else {
      userActions.fetchUserDetails()(dispatch, getState);
    }
  }

  return next(action);
};

export default function configureStore(initialState?: ApplicationState) {
  const middleware = [thunk, socketsMiddleware];

  const rootReducer = combineReducers({
    ...reducers,
  });

  const enhancers = [];
  const windowIfDefined = typeof window === "undefined" ? null : (window as any);
  if (windowIfDefined && windowIfDefined.__REDUX_DEVTOOLS_EXTENSION__) {
    enhancers.push(windowIfDefined.__REDUX_DEVTOOLS_EXTENSION__());
  }

  const store = createStore(rootReducer, initialState, compose(applyMiddleware(...middleware), ...enhancers));
  return store;
}
