import "./styles.scss";
import "@fortawesome/fontawesome-free/css/all.css";
import "@creativebulma/bulma-tooltip/dist/bulma-tooltip.min.css";
import "@creativebulma/bulma-badge/dist/bulma-badge.min.css";
import "bulma-switch/dist/css/bulma-switch.min.css";

import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import { createBrowserHistory } from "history";
import configureStore from "./store/configureStore";
import App from "./App";

// Create browser history to use in the Redux store
const baseUrl = document
  .getElementsByTagName("base")[0]
  .getAttribute("href") as string;
const history = createBrowserHistory({ basename: baseUrl });

// Get the application-wide store instance, prepopulating with state from the server where available.
const store = configureStore(history);

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App token={store.getState().user.user?.token} />
    </ConnectedRouter>
  </Provider>,
  document.getElementById("root")
);
