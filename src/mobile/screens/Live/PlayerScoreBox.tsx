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
    <View key={player.playerName} style={{ ...styles.playerNameScoreView }}>
      <Text style={{ ...styles.playerNameText, borderColor: playerScore !== 0 ? "green" : "red" }}>
        {player.playerName.slice(0, 2).toLowerCase()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  playerNameScoreView: {
    alignItems: "center",
  },
  playerNameText: {
    minWidth: 50,
    fontSize: 20,
    borderWidth: 5,
    borderRadius: 10,
    borderColor: "#E91E63",
    textAlign: "center",
    padding: 5,
  },
});

export default PlayerScoreBox;
