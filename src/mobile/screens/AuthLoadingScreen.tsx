import React, { useEffect } from "react";
import { ActivityIndicator, StatusBar, View } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { StackParamList } from "../types";
import { connect, ConnectedProps } from "react-redux";
import * as UserStore from "../store/User";
import { ApplicationState } from "../store";

const connector = connect(null, UserStore.actionCreators);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {} & StackScreenProps<StackParamList, "AuthLoading">;

const AuthLoadingScreen = ({ loadLogginInfo }: Props) => {
  useEffect(() => {
    loadLogginInfo();
  }, []);

  return (
    <View>
      <ActivityIndicator />
      <StatusBar barStyle="default" />
    </View>
  );
};

export default connector(AuthLoadingScreen);
