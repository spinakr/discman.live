import { Round } from "./store/ActiveRound";

export type StackParamList = {
  Login: undefined;
  Settings: undefined;
  AuthLoading: undefined;
  Home: undefined;
  NotFound: undefined;
};

export type HomeBottomTabParamList = {
  "Discman.live": undefined;
  Play: undefined;
  Settings: undefined;
  Rounds: { screen: string; params: any } | undefined;
};

export type LiveBottomTabParamList = {
  Register: undefined;
  Scorecard: undefined;
};

export type LoginParamList = {
  LoginScreen: undefined;
};

export type PlayStackParamList = {
  CreateRound: undefined;
  Live: undefined;
  Summary: undefined;
};

export type RoundsStackParamList = {
  Rounds: undefined;
  Round: { round: Round };
};
