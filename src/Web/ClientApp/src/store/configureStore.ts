import {
  applyMiddleware,
  combineReducers,
  compose,
  createStore,
  Middleware,
  MiddlewareAPI,
  Dispatch,
  Action,
  AnyAction,
} from "redux";
import thunk from "redux-thunk";
import { connectRouter, routerMiddleware } from "connected-react-router";
import { History } from "history";
import { ApplicationState, reducers } from "./";
import * as signalR from "@microsoft/signalr";
import { actionCreators as roundsActions, Round } from "./Rounds";
import { actionCreators as notificationActions } from "./Notifications";
import logger from "../logger";
import { User } from "./User";

const createHub = () => {
  return new signalR.HubConnectionBuilder()
    .withUrl("/roundHub", {
      accessTokenFactory: () => {
        const userString = localStorage.getItem("user");
        if (!userString) return "";
        const user: User = JSON.parse(userString);
        var activeToken = user.token;
        return activeToken ? activeToken : "";
      },
    })
    .build();
};

export let hub = createHub();

const connectHub = (dispatch: Dispatch<AnyAction>) => {
  hub.on("roundUpdated", (roundJson: string) => {
    let round: Round = JSON.parse(roundJson);
    dispatch(roundsActions.roundWasUpdated(round));
  });

  hub.on("spectatorJoined", (roundId: string, username: string) => {
    dispatch(roundsActions.specJoined(roundId, username));
  });
  hub.on("spectatorLeft", (roundId: string, username: string) => {
    dispatch(roundsActions.specLeft(roundId, username));
  });

  hub.start();
};

const socketsMiddleware: Middleware = ({
  dispatch,
  getState,
}: MiddlewareAPI) => (next: Dispatch) => <A extends Action>(action: A) => {
  if (
    action.type === "CONNECT_TO_HUB" &&
    hub.state === signalR.HubConnectionState.Disconnected
  ) {
    const state: ApplicationState = getState();
    if (!state.user?.loggedIn) return;
    connectHub(dispatch);
  }

  //Handle spectator notifications
  if (action.type === "SPEC_JOINED") {
    const a: any = action;
    if (hub.state === signalR.HubConnectionState.Disconnected) {
      connectHub(dispatch);
      setTimeout(() => {}, 1000);
    }
    hub.invoke("SpectatorJoined", a.roundId);
  }
  if (action.type === "SPEC_LEFT") {
    const a: any = action;
    if (hub.state === signalR.HubConnectionState.Disconnected) {
      connectHub(dispatch);
      setTimeout(() => {}, 1000);
    }
    hub.invoke("SpectatorLeft", a.roundId);
  }

  return next(action);
};

const crashReporter: Middleware = ({ dispatch, getState }: MiddlewareAPI) => (
  next: Dispatch
) => <A extends Action>(action: A) => {
  try {
    return next(action);
  } catch (err) {
    console.error("Caught an exception!", err);
    logger.push({
      tag: "redux",
      application: "discman-client",
      reduxState: getState(),
      action: action,
      exception: err,
    });
    throw err;
  }
};

export default function configureStore(
  history: History,
  initialState?: ApplicationState
) {
  const middleware = [
    thunk,
    routerMiddleware(history),
    socketsMiddleware,
    crashReporter,
  ];

  const rootReducer = combineReducers({
    ...reducers,
    router: connectRouter(history),
  });

  const enhancers = [];
  const windowIfDefined =
    typeof window === "undefined" ? null : (window as any);
  if (windowIfDefined && windowIfDefined.__REDUX_DEVTOOLS_EXTENSION__) {
    enhancers.push(windowIfDefined.__REDUX_DEVTOOLS_EXTENSION__());
  }

  const store = createStore(
    rootReducer,
    initialState,
    compose(applyMiddleware(...middleware), ...enhancers)
  );
  store.dispatch({ type: "CONNECT_TO_HUB" });
  return store;
}
