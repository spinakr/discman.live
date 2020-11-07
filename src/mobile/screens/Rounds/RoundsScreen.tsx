import { createStackNavigator, StackScreenProps } from "@react-navigation/stack";
import * as React from "react";
import { FlatList, StyleSheet } from "react-native";
import { connect, ConnectedProps } from "react-redux";
import { ApplicationState } from "../../store";
import * as RoundStore from "../../store/Rounds";
import * as UserStore from "../../store/User";
import { View, Text } from "../../components/Themed";
import CommonNavHeader from "../../navigation/CommonNavHeader";
import { RoundsStackParamList } from "../../types";
import { useState } from "react";
import { Round } from "../../store/ActiveRound";
import { TouchableOpacity } from "react-native-gesture-handler";

const mapState = (state: ApplicationState) => {
  return {
    rounds: state.rounds?.rounds,
    username: state.user?.user?.username,
  };
};

const connector = connect(mapState, { ...RoundStore.actionCreators, ...UserStore.actionCreators });

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {} & StackScreenProps<RoundsStackParamList, "Rounds">;

const RoundItem = ({ item, username }: { item: Round; username: string }) => {
  const startTime = new Date(item.startTime);
  const startedAgo = Date.now().valueOf() - startTime.valueOf();
  const startedAgoDays = startedAgo / 1000 / 60 / 24;
  const playerScores = item.playerScores.find((p) => p.playerName === username);
  const totalScore = playerScores?.scores.reduce((total, score) => {
    return total + score.relativeToPar;
  }, 0);
  return (
    <TouchableOpacity>
      <View style={styles.roundItem}>
        <View style={styles.row}>
          <Text style={styles.item}>{item.courseName}</Text>
          <Text style={styles.item}>{startTime.toLocaleDateString()}</Text>
          <Text style={styles.item}>
            {totalScore && (
              <>
                {totalScore < 0 ? "-" : "+"}
                {Math.abs(totalScore)}
              </>
            )}
          </Text>
        </View>
        <View style={styles.row}></View>
      </View>
    </TouchableOpacity>
  );
};

const RoundsScreen = ({ navigation, username, rounds, fetchMoreRounds }: Props) => {
  const [page, setPage] = useState(1);
  React.useEffect(() => {
    fetchMoreRounds(username);
  }, [username, page]);
  if (!rounds) return null;
  return (
    <View style={styles.container}>
      <FlatList
        data={rounds}
        renderItem={({ item }) => <RoundItem item={item} username={username || ""} />}
        keyExtractor={(item) => item.id}
        onEndReached={() => fetchMoreRounds(username)}
        initialNumToRender={8}
        onEndReachedThreshold={0.3}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: { flex: 1, flexDirection: "row" },
  item: { flex: 1 },
  roundItem: { flex: 1, padding: 20, borderBottomWidth: 1 },
});

const Stack = createStackNavigator<{ Rounds: undefined }>();

const StackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Rounds" screenOptions={{ header: () => <CommonNavHeader /> }}>
      <Stack.Screen name="Rounds" component={connector(RoundsScreen)} />
    </Stack.Navigator>
  );
};

export default StackNavigator;
