import { Ionicons } from "@expo/vector-icons";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { AppStateStatus } from "react-native";
import { AppState } from "react-native";
import { useDispatch } from "react-redux";
import { AppStateForegroundAction } from "../store";

export default function dispatchAppStateChanges() {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const dispatch = useDispatch();
  useEffect(() => {
    AppState.addEventListener("change", _handleAppStateChange);

    return () => {
      AppState.removeEventListener("change", _handleAppStateChange);
    };
  }, []);

  const _handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (appState.current.match(/inactive|background/) && nextAppState === "active") {
      dispatch({ type: "APPSTATE_FORGROUND" } as AppStateForegroundAction);
    }

    appState.current = nextAppState;
    setAppStateVisible(appState.current);
  };
}
