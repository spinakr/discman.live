import * as Login from "./Login";
import * as Rounds from "./Rounds";

// The top-level state object
export interface ApplicationState {
  login: Login.LoginState | undefined;
  rounds: Rounds.RoundsState | undefined;
}

export const reducers = {
  login: Login.reducer,
  rounds: Rounds.reducer,
};

export interface AppThunkAction<TAction> {
  (dispatch: (action: TAction) => void, getState: () => ApplicationState): void;
}

window.addEventListener("blur", () => {
  console.log("BLURED");
});
window.addEventListener("focus", () => {
  console.log("focused");
});
