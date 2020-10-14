import { StackScreenProps } from "@react-navigation/stack";
import { WebView } from "react-native-webview";
import * as React from "react";
import { StyleSheet } from "react-native";
import { HomeBottomTabParamList, StackParamList } from "../types";
import { SafeAreaView } from "react-native-safe-area-context";
import { ApplicationState } from "../store";
import { connect, ConnectedProps } from "react-redux";
import * as UserStore from "../store/User";
import Urls from "../constants/Urls";

const mapState = (state: ApplicationState) => {
  return {
    user: state.user?.user,
  };
};

const connector = connect(mapState, UserStore.actionCreators);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {} & StackScreenProps<HomeBottomTabParamList, "Discman.live">;

const DiscmanScreen = ({ user }: Props) => {
  const userstring = JSON.stringify(user);
  const injectedCode = () => {
    return `
        var storedToken = localStorage.getItem('user');
        if (!storedToken || storedToken !== '${userstring}') {
          localStorage.setItem('user', '${userstring}');
          location.reload();
        }
    `;
  };

  if (!user?.token) return null;
  return (
    <WebView
      source={{ uri: `${Urls.discmanWebBaseUrl}?token=${encodeURI(JSON.stringify(user))}` }}
      javaScriptEnabled={true}
      injectedJavaScript={injectedCode()}
      domStorageEnabled={true}
    />
  );
};

const styles = StyleSheet.create({ safeArea: { flex: 1, justifyContent: "flex-start" } });

export default connector(DiscmanScreen);
