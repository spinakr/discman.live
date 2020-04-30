import {
  applyMiddleware,
  combineReducers,
  compose,
  createStore,
  Middleware,
  MiddlewareAPI,
  Dispatch,
  Action,
} from "redux";
import thunk from "redux-thunk";
import { connectRouter, routerMiddleware } from "connected-react-router";
import { History } from "history";
import { ApplicationState, reducers } from "./";
import * as signalR from "@microsoft/signalr";
import { actionCreators as roundsActions, Round } from "./Rounds";
import { User } from "./Login";

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

let hub = createHub();

const socketsMiddleware: Middleware = ({
  dispatch,
  getState,
}: MiddlewareAPI) => (next: Dispatch) => <A extends Action>(action: A) => {
  if (
    action.type === "CONNECT_TO_HUB" &&
    hub.state !== signalR.HubConnectionState.Connected
  ) {
    hub.on("roundUpdated", (roundJson: string) => {
      let round: Round = JSON.parse(roundJson);
      dispatch(roundsActions.roundWasUpdated(round));
    });

    hub.start();
  }
  return next(action);
};

export default function configureStore(
  history: History,
  initialState?: ApplicationState
) {
  const middleware = [thunk, routerMiddleware(history), socketsMiddleware];

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

  return createStore(
    rootReducer,
    initialState,
    compose(applyMiddleware(...middleware), ...enhancers)
  );
}
