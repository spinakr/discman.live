import * as React from "react";
import { View, Text } from "../../components/Themed";
import { HoleScore, PlayerScore, Round } from "../../store/ActiveRound";
import { StyleSheet } from "react-native";

export interface PlayerScoreBoxProps {
  player: PlayerScore;
  activeHole: number;
}
const PlayerScoreBox = ({ player, activeHole }: PlayerScoreBoxProps) => {
  const playerScore = player.scores.find((s) => s.hole.number === activeHole)?.strokes || 0;
  return (
    <View key={player.playerName} style={{ ...styles.playerNameScoreView, borderColor: playerScore !== 0 ? "green" : "red" }}>
      <Text style={{ ...styles.playerNameText }}>{player.playerName}</Text>
      <Text style={{ ...styles.playerScoreText }}>{playerScore !== 0 && playerScore}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  playerNameScoreView: {
    alignItems: "center",
    borderWidth: 3,
    borderRadius: 10,
    borderColor: "#E91E63",
    padding: 1,
    minWidth: 65,
  },

  playerScoreText: {
    padding: 5,
  },
  playerNameText: {
    padding: 5,
    fontSize: 20,
  },
});

export default PlayerScoreBox;
