import React from "react";
import { ActivityIndicator, StatusBar, View } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { StackParamList } from "../types";

const AuthLoadingScreen = ({ navigation }: StackScreenProps<StackParamList, "AuthLoading">) => {
  // Render any loading content that you like here
  return (
    <View>
      <ActivityIndicator />
      <StatusBar barStyle="default" />
    </View>
  );
};

export default AuthLoadingScreen;
