import { StackScreenProps } from "@react-navigation/stack";
import * as React from "react";
import { StyleSheet, View, Text } from "react-native";
import { connect, ConnectedProps } from "react-redux";
import { ApplicationState } from "../store";
import { PlayStackParamList } from "../types";
import * as UserStore from "../store/User";
import { useEffect } from "react";

const mapState = (state: ApplicationState) => {
  return {
    activeRound: state.user?.userDetails?.activeRound,
    user: state.user?.user,
  };
};

const connector = connect(mapState, UserStore.actionCreators);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {} & StackScreenProps<PlayStackParamList, "CreateRound">;

const CreateRoundScreen = ({ activeRound, navigation, fetchUserDetails, user }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Round!</Text>
    </View>
  );
};

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

export default connector(CreateRoundScreen);
