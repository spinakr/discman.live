import * as WeatherForecasts from "./WeatherForecasts";
import * as Counter from "./Counter";
import * as Login from "./Login";
import * as Rounds from "./Rounds";

// The top-level state object
export interface ApplicationState {
  counter: Counter.CounterState | undefined;
  weatherForecasts: WeatherForecasts.WeatherForecastsState | undefined;
  login: Login.LoginState | undefined;
  rounds: Rounds.RoundsState | undefined;
}

export const reducers = {
  counter: Counter.reducer,
  weatherForecasts: WeatherForecasts.reducer,
  login: Login.reducer,
  rounds: Rounds.reducer,
};

// This type can be used as a hint on action creators so that its 'dispatch' and 'getState' params are
// correctly typed to match your store.
export interface AppThunkAction<TAction> {
  (dispatch: (action: TAction) => void, getState: () => ApplicationState): void;
}
