import { StackScreenProps } from "@react-navigation/stack";
import * as React from "react";
import { StyleSheet } from "react-native";
import { connect, ConnectedProps } from "react-redux";
import { ApplicationState } from "../store";
import { HomeBottomTabParamList, PlayStackParamList } from "../types";
import * as UserStore from "../store/User";
import { useEffect } from "react";
import { View, Text } from "../components/Themed";

const mapState = (state: ApplicationState) => {
  return {
    activeRound: state.user?.userDetails?.activeRound,
    user: state.user?.user,
  };
};

const connector = connect(mapState, UserStore.actionCreators);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {} & StackScreenProps<HomeBottomTabParamList, "Play"> & StackScreenProps<PlayStackParamList, "CreateRound">;

const CreateRoundScreen = ({ navigation }: Props) => {
  return (
    <View style={styles.container}>
      <Text>
        Go to
        <Text onPress={() => navigation.navigate("Discman.live")}> discman.live </Text>
        to start a round!{"\n"}It will appear here for the players after started.
      </Text>
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
