import * as React from "react";
import { View, Text } from "../../components/Themed";
import { PlayerCourseStats, PlayerScore } from "../../store/ActiveRound";
import { StyleSheet } from "react-native";

export interface PodiumProps {
  scores: PlayerScore[];
  courseStats: PlayerCourseStats[] | undefined;
}

const Podium = ({ scores, courseStats }: PodiumProps) => {
  const sortedScores = scores.sort((a, b) => {
    const aTotal = a.scores.reduce((total, score) => {
      return total + score.relativeToPar;
    }, 0);
    const bTotal = b.scores.reduce((total, score) => {
      return total + score.relativeToPar;
    }, 0);
    return aTotal - bTotal;
  });
  return (
    <>
      <View style={styles.headerRow}>
        <View style={styles.cell}>
          <Text></Text>
        </View>
        <View style={styles.cell}>
          <Text>Total</Text>
        </View>
        <View style={styles.cell}>
          <Text>Vs. avg.</Text>
        </View>
      </View>

      {sortedScores.map((p, i) => {
        const totalScore = p.scores.reduce((total, score) => {
          return total + score.relativeToPar;
        }, 0);
        const improv = Math.round(courseStats?.find((s) => s.playerName === p.playerName)?.thisRoundVsAverage || 0);
        return (
          <View style={[styles.scoresRow]} key={i}>
            <View style={[styles.cell]}>
              <Text numberOfLines={1} style={{}}>
                {p.playerName}
              </Text>
            </View>
            <View style={[styles.cell]}>
              <Text>
                {totalScore > 0 ? "+" : ""}
                {totalScore}
              </Text>
            </View>
            <View style={[styles.cell]}>
              <Text>
                {improv > 0 ? "+" : ""}
                {improv}
              </Text>
            </View>
          </View>
        );
      })}
    </>
  );
};

const styles = StyleSheet.create({
  scoresRow: { flex: 1, flexDirection: "row", borderColor: "lightgrey", borderBottomWidth: 1 },
  headerRow: { flex: 1, flexDirection: "row", borderColor: "lightgrey", borderBottomWidth: 3, borderTopWidth: 1 },
  cell: {
    flex: 1,
    borderBottomWidth: 3,
    borderColor: "transparent",
    borderLeftColor: "lightgrey",
    borderLeftWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
  },
});

export default Podium;
