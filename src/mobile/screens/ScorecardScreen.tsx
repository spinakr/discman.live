import * as React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { ApplicationState } from "../store";
import { connect, ConnectedProps } from "react-redux";
import * as UserStore from "../store/User";
import { View, Text } from "../components/Themed";
import { PlayerScore, StrokeSpec } from "../store/ActiveRound";
import { addOrientationChangeListener, getOrientationAsync, Orientation } from "expo-screen-orientation";
import { useEffect, useState } from "react";
import ProgressCircle from "react-native-progress-circle";
import ScoreCard from "./Rounds/ScoreCard";

const mapState = (state: ApplicationState) => {
  return {
    activeRound: state.activeRound,
    user: state.user,
  };
};

const connector = connect(mapState, UserStore.actionCreators);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {};

const ScorecardScreen = ({ activeRound, user }: Props) => {
  const round = activeRound?.round;
  const playerScores = round?.playerScores.find((p) => p.playerName === user?.user?.username)?.scores || round?.playerScores[0].scores;
  const scores = round?.playerScores;
  const courseStats = activeRound?.playerCourseStats;
  if (!playerScores || !scores) return null;
  return (
    <ScrollView style={[styles.container, {}]}>
      <View style={styles.scoreboardSection}>
        <View style={styles.scoreBoardRowHeader}>
          <View style={styles.scoreBoardCell}></View>
          <View style={styles.scoreBoardCell}>
            <Text>Score</Text>
          </View>
          <View style={styles.scoreBoardCell}>
            <Text>Vs. avg.</Text>
          </View>
          <View style={styles.scoreBoardCell}>
            <Text>Vs. best</Text>
          </View>
        </View>
        {round?.playerScores.map((s) => {
          const totalScore = s.scores.reduce((total, score) => {
            return total + score.relativeToPar;
          }, 0);
          const courseStat = courseStats?.find((c) => c.playerName === s.playerName);
          if (!courseStat) return null;
          return (
            <View style={styles.scoreBoardRow} key={s.playerName}>
              <View style={styles.scoreBoardNameCell}>
                <Text numberOfLines={1}>{s.playerName}</Text>
              </View>
              <View style={styles.scoreBoardCell}>
                <Text>{totalScore}</Text>
              </View>
              <View style={styles.scoreBoardCell}>
                <Text>{courseStat.thisRoundVsAverage.toFixed(0)}</Text>
              </View>
              <View style={styles.scoreBoardCell}>
                <Text>{courseStat.playerCourseRecord - totalScore}</Text>
              </View>
            </View>
          );
        })}
      </View>
      <View style={styles.scorecardSection}>
        <ScoreCard scores={scores} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scoreboardSection: { flex: 1, paddingTop: 30, marginBottom: 10 },
  scoreBoardRow: { flex: 1, flexDirection: "row", borderBottomColor: "lightgrey", borderBottomWidth: 1 },
  scoreBoardCell: { flex: 1, alignItems: "center", borderRightWidth: 1, borderRightColor: "lightgrey", padding: 2 },
  scoreBoardNameCell: { flex: 1, borderRightWidth: 1, borderRightColor: "lightgrey", padding: 2 },
  scoreBoardRowHeader: { flex: 1, flexDirection: "row", borderBottomColor: "lightgrey", borderBottomWidth: 2 },
  scorecardSection: { flex: 1 },
  statsSection: { flex: 1 },
});

export default connector(ScorecardScreen);
