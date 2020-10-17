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

const HoleInfo = ({ playerCourseStats, activeHoleNumber, hole }: HoleInfoProps) => {
  if (!playerCourseStats) return null;
  const holeStats = playerCourseStats.holeStats.find((s) => s.holeNumber === activeHoleNumber);
  const birdieRate = holeStats && ((holeStats.birdies / playerCourseStats.roundsPlayed) * 100).toFixed(0);
  const parRate = holeStats && ((holeStats.pars / playerCourseStats.roundsPlayed) * 100).toFixed(0);
  const worseRate = holeStats && ((holeStats.worseThanPar / playerCourseStats.roundsPlayed) * 100).toFixed(0);
  return (
    <View style={styles.holeInfoSection}>
      <Text>
        <Text style={styles.descritionText}>best </Text>
        {holeStats && <Text style={styles.statsText}>{hole.par + holeStats?.bestScore} </Text>}
        {holeStats && holeStats?.bestScore === -1 && <FontAwesome5 name="earlybirds" size={20} color="black" />}
        {holeStats && holeStats?.bestScore === -2 && <FontAwesome5 name="star" size={20} color="black" />}
        {holeStats && holeStats?.bestScore === 0 && <FontAwesome5 name="square" size={20} color="black" />}
      </Text>
      <Text>
        <Text style={styles.descritionText}>avg </Text>
        {holeStats && <Text style={styles.statsText}>{holeStats?.averageScore.toFixed(1)}</Text>}
      </Text>
      <Text>
        <Text style={styles.descritionText}>birdies </Text>
        {holeStats && <Text style={styles.statsText}>{birdieRate} %</Text>}
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
