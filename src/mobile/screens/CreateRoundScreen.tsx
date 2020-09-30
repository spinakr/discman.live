import { StackScreenProps } from "@react-navigation/stack";
import * as React from "react";
import { StyleSheet, View, Text } from "react-native";
import { PlayStackParamList } from "../types";

export default function CreateRoundScreen({}: StackScreenProps<PlayStackParamList, "CreateRound">) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Round!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
