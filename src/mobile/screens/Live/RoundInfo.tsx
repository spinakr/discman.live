import * as React from "react";
import { View, Text } from "../../components/Themed";
import { HoleScore, Round } from "../../store/ActiveRound";
import { StyleSheet } from "react-native";

export interface RoundInfoProps {
  holeScore: HoleScore;
  round: Round;
  activeHole: number;
}
const RoundInfo = ({ holeScore, round, activeHole }: RoundInfoProps) => {
  return (
    <View style={styles.roundInfoSection}>
      <Text style={styles.titleText}>{round.courseName || "safds"}</Text>
      <Text style={styles.subtitleText}>Hole {holeScore?.hole.number}</Text>
      <Text style={styles.infoText}>Par {holeScore?.hole.par}</Text>
      <Text style={styles.infoText}>{holeScore?.hole.distance} meters</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  roundInfoSection: { flex: 0.5, padding: 5, justifyContent: "space-evenly", alignItems: "center", flexDirection: "row" },
  subtitleText: { fontSize: 18 },
  titleText: { fontSize: 20, fontWeight: "bold" },
  infoText: { fontSize: 12 },
});

export default RoundInfo;
