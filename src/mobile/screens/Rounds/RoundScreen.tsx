import { StackScreenProps } from "@react-navigation/stack";
import * as React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { connect, ConnectedProps } from "react-redux";
import { ApplicationState } from "../../store";
import * as RoundStore from "../../store/Rounds";
import { View, Text } from "../../components/Themed";
import { RoundsStackParamList } from "../../types";
import ScoreCard from "./ScoreCard";
import ProgressCircle from "react-native-progress-circle";
import Podium from "./Podium";

const mapState = (state: ApplicationState) => {
  return { roundStats: state.rounds?.finishedRoundStats, courseStats: state.rounds?.courseStats };
};

const connector = connect(mapState, { ...RoundStore.actionCreators });

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {} & StackScreenProps<RoundsStackParamList, "Round">;

const RoundScreen = ({ route, roundStats, courseStats, fetchUsersRoundStats, fetchStatsOnCourse }: Props) => {
  const { round } = route.params;
  const roundId = round.id;
  React.useEffect(() => {
    roundId && fetchUsersRoundStats(round.id);
    roundId && fetchStatsOnCourse(round.id);
  }, [roundId]);
  return (
    <ScrollView style={styles.container}>
      <View style={styles.infoSection}>
        <Text style={styles.headerText}>
          {round.courseName} - {new Date(round.startTime).toLocaleDateString()}
        </Text>
      </View>
      <View style={styles.podiumSection}>
        <Podium scores={round.playerScores} courseStats={courseStats} />
      </View>
      <View style={styles.scoresSection}>
        <ScoreCard scores={round.playerScores} />
      </View>
      <View style={styles.statsSection}>
        {roundStats?.map((s, i) => {
          const birdiePercent = +(s.birdieRate * 100).toFixed();
          const parPercent = +(s.parRate * 100).toFixed();
          const obPercent = +(s.obRate * 100).toFixed();
          return (
            <View style={styles.playerStatsSection} key={i}>
              <View style={styles.playerNameView}>
                <Text style={styles.playerNameText} numberOfLines={1}>
                  {s.username}
                </Text>
              </View>
              <View style={styles.statsRow}>
                <View style={styles.statView}>
                  <ProgressCircle percent={birdiePercent} radius={40} borderWidth={8} color="#3399FF" shadowColor="#999" bgColor="#fff">
                    <Text style={{ fontSize: 18 }}>{birdiePercent}%</Text>
                  </ProgressCircle>
                  <Text>Birdies</Text>
                </View>
                <View style={styles.statView}>
                  <ProgressCircle percent={parPercent} radius={40} borderWidth={8} color="#3399FF" shadowColor="#999" bgColor="#fff">
                    <Text style={{ fontSize: 18 }}>{parPercent}%</Text>
                  </ProgressCircle>
                  <Text>Pars</Text>
                </View>
                <View style={styles.statView}>
                  <ProgressCircle percent={obPercent} radius={40} borderWidth={8} color="#3399FF" shadowColor="#999" bgColor="#fff">
                    <Text style={{ fontSize: 18 }}>{obPercent}%</Text>
                  </ProgressCircle>
                  <Text>OBs</Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  infoSection: { flex: 1, alignItems: "center", paddingBottom: 5 },
  scoresSection: { flex: 1, marginBottom: 10 },
  podiumSection: { flex: 1, marginBottom: 10 },
  headerText: { fontSize: 20 },
  statsSection: { flex: 1 },
  playerStatsSection: { flex: 1, margin: 10 },
  statsRow: { flex: 1, flexDirection: "row" },
  playerNameView: { flex: 1, marginBottom: 2, borderBottomWidth: 1, borderBottomColor: "lightgrey" },
  playerNameText: { fontWeight: "bold" },
  statView: { flex: 3, alignItems: "center" },
});

export default connector(RoundScreen);
