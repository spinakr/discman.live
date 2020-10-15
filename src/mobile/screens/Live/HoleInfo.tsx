import * as React from "react";
import { View, Text } from "../../components/Themed";
import { Hole, HoleScore, PlayerCourseStats, Round } from "../../store/ActiveRound";
import { StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

export interface HoleInfoProps {
  playerCourseStats: PlayerCourseStats | undefined;
  activeHoleNumber: number;
  hole: Hole;
}

const scoreName = (relativeScore: number, holePar: number) => {
  switch (holePar - relativeScore) {
    case -1:
      return "Birdie";
    case -1:
      return "Eagle";
  }
};

const HoleInfo = ({ playerCourseStats, activeHoleNumber, hole }: HoleInfoProps) => {
  if (!playerCourseStats) return null;
  const holeStats = playerCourseStats.holeStats.find((s) => s.holeNumber === activeHoleNumber);
  if (!holeStats) return null;
  const bestScore = hole.par + holeStats.bestScore;
  return (
    <View style={styles.holeInfoSection}>
      <Text>
        <Text style={styles.descritionText}>avg </Text>
        <Text style={styles.statsText}>{holeStats.averageScore.toFixed(1)}</Text>
      </Text>
      <Text>
        <Text style={styles.descritionText}>best </Text>
        <Text style={styles.statsText}>{bestScore} </Text>
        {holeStats.bestScore === -1 && <FontAwesome5 name="earlybirds" size={20} color="black" />}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  holeInfoSection: { flex: 0.5, padding: 5, justifyContent: "space-evenly", alignItems: "center", flexDirection: "row" },
  statsText: { fontSize: 18 },
  descritionText: { fontSize: 12 },
});

export default HoleInfo;
