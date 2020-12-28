import { createStackNavigator, StackScreenProps } from "@react-navigation/stack";
import * as React from "react";
import { FlatList, ScrollView, StyleSheet } from "react-native";
import { connect, ConnectedProps } from "react-redux";
import { ApplicationState } from "../../store";
import * as RoundStore from "../../store/Rounds";
import * as UserStore from "../../store/User";
import { View, Text } from "../../components/Themed";
import CommonNavHeader from "../../navigation/CommonNavHeader";
import { Round } from "../../store/ActiveRound";
import { TouchableOpacity } from "react-native-gesture-handler";
import RoundScreen from "./RoundScreen";
import { HomeBottomTabParamList, RoundsStackParamList } from "../../types";
import { Divider } from "react-native-elements";

const mapState = (state: ApplicationState) => {
  return {
    rounds: state.rounds?.rounds,
    username: state.user?.user?.username,
  };
};

const connector = connect(mapState, { ...RoundStore.actionCreators, ...UserStore.actionCreators });

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {} & StackScreenProps<RoundsStackParamList>;

const calculateDurationString = (round: Round) => {
  if (round.isCompleted && round.completedAt === "0001-01-01T00:00:00") return "";
  const durationMinutes = round.roundDuration;
  const hours = durationMinutes / 60;
  const rhours = Math.floor(hours);
  const minutes = (hours - rhours) * 60;
  const rminutes = Math.round(minutes);

  const hourPart = rhours !== 0 ? `${rhours} h ` : "";
  const minPart = `${rminutes} min`;

  return `${hourPart}${minPart}`;
};

const RoundItem = ({ item, username, navigateRound }: { item: Round; username: string; navigateRound: (round: Round) => void }) => {
  const startTime = new Date(item.startTime);
  const startedAgo = Date.now().valueOf() - startTime.valueOf();
  const playerScores = item.playerScores.find((p) => p.playerName === username);
  return (
    <TouchableOpacity onPress={() => navigateRound(item)}>
      <View style={styles.roundItem}>
        <View style={styles.row}>
          <Text numberOfLines={1} style={[styles.item, { fontWeight: "bold", fontSize: 18 }]}>
            {item.courseName}
          </Text>
          <Text style={styles.item}>{startTime.toLocaleDateString()}</Text>
          <Text style={styles.durationItem}>{calculateDurationString(item)}</Text>
        </View>
        <Divider />
        <View style={styles.row}>
          {item.playerScores
            .filter((r) => r.playerName !== username)
            .concat(playerScores ? [playerScores] : [])
            .reverse()
            .map((p) => {
              const totalScore = p.scores.reduce((total, score) => {
                return total + score.relativeToPar;
              }, 0);
              return (
                <View style={styles.playerItem} key={p.playerName}>
                  <Text numberOfLines={1} style={styles.playerItemText}>
                    {p.playerName}
                  </Text>
                  <Text numberOfLines={1} style={styles.playerItemText}>
                    ({totalScore > 0 ? "+" : ""} {Math.abs(totalScore)})
                  </Text>
                </View>
              );
            })}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const RoundsScreen = ({ navigation, route, username, rounds, fetchMoreRounds }: Props) => {
  React.useEffect(() => {
    rounds?.length === 0 && fetchMoreRounds(username);
  }, []);
  if (!rounds) return null;
  return (
    <View style={styles.container}>
      <FlatList
        data={rounds}
        renderItem={({ item }) => (
          <RoundItem
            item={item}
            username={username || ""}
            navigateRound={() => {
              navigation.push("Round", { round: item });
            }}
          />
        )}
        keyExtractor={(item) => `${item.id}`}
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
  row: { flex: 1, flexDirection: "row", marginBottom: 5, marginTop: 5, alignContent: "space-between", justifyContent: "space-between" },
  item: { flex: 2 },
  durationItem: { flex: 1 },
  roundItem: { flex: 1, padding: 15, borderBottomWidth: 1 },
  playerItem: { flex: 1, paddingRight: 2, flexDirection: "column", alignContent: "center", justifyContent: "center" },
  playerItemText: { flex: 1 },
});

const Stack = createStackNavigator<RoundsStackParamList>();

const StackNavigator = () => {
  React.useEffect;
  return (
    <Stack.Navigator initialRouteName="Rounds" screenOptions={{ header: () => <CommonNavHeader /> }}>
      <Stack.Screen name="Rounds" component={connector(RoundsScreen)} />
      <Stack.Screen name="Round" component={RoundScreen} />
    </Stack.Navigator>
  );
};

export default StackNavigator;
