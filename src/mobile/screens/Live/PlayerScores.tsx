import * as React from "react";
import { View, Text } from "../../components/Themed";
import { HoleScore, PlayerScore, Round } from "../../store/ActiveRound";
import { StyleSheet, TouchableOpacity } from "react-native";
import GestureRecognizer from "react-native-swipe-gestures";
import DiscgolfBasketIcon from "../../components/DiscgolfBasketIcon";

export interface PlayerScoresProps {
  playerScores: PlayerScore[];
  activeHoleIndex: number;
  goToNextHole: () => void;
  goToPreviousHole: () => void;
}
const PlayerScores = ({ playerScores, activeHoleIndex, goToNextHole, goToPreviousHole }: PlayerScoresProps) => {
  const courseHoles = playerScores[0].scores;
  const currentHole = courseHoles[activeHoleIndex];
  const nextHole = courseHoles.length - 1 >= activeHoleIndex + 1 ? courseHoles[activeHoleIndex + 1] : null;
  const prevHole = activeHoleIndex - 1 > -1 ? courseHoles[activeHoleIndex - 1] : null;
  return (
    <GestureRecognizer style={styles.scoresContainer} onSwipeRight={() => goToPreviousHole()} onSwipeLeft={() => goToNextHole()}>
      <View style={styles.scoresHeaderRow}>
        <View style={styles.scoresCellHead}>
          <Text style={{ fontSize: 8 }}></Text>
        </View>
        <View style={styles.scoresTotalCell}></View>
        <TouchableOpacity onPress={() => goToPreviousHole()} style={styles.scoresCell}>
          {prevHole && <Text style={{ fontSize: 8 }}>{prevHole?.hole.number}</Text>}
        </TouchableOpacity>
        <View style={styles.currentScoresCell}>
          <Text style={{ fontSize: 8 }}>{currentHole.hole.number}</Text>
        </View>
        <TouchableOpacity onPress={() => goToNextHole()} style={styles.scoresCell}>
          {nextHole && <Text style={{ fontSize: 8 }}>{nextHole?.hole.number}</Text>}
        </TouchableOpacity>
      </View>
      {playerScores.map((p) => {
        const previousHole = p.scores[activeHoleIndex - 1];
        const currentHole = p.scores[activeHoleIndex];
        const nextHole = p.scores[activeHoleIndex + 1];
        const totalScore = p.scores.reduce((total, score) => {
          return total + score.relativeToPar;
        }, 0);

        return (
          <View style={styles.scoresRow} key={p.playerName}>
            <View style={styles.scoresCellHead}>
              <DiscgolfBasketIcon color={currentHole.strokes === 0 ? "red" : "green"} size={40} />
              <Text numberOfLines={1} style={styles.scoresHeadText}>
                {p.playerName}
              </Text>
            </View>
            <View style={styles.scoresTotalCell}>
              <Text>
                ({totalScore > 0 && "+"}
                {totalScore < 0 && "-"}
                {Math.abs(totalScore)})
              </Text>
            </View>
            <View style={styles.scoresCell}>
              {prevHole && <Text style={styles.scoresText}>{previousHole.strokes === 0 ? "-" : previousHole.relativeToPar}</Text>}
            </View>
            <View style={styles.currentScoresCell}>
              {<Text style={styles.currentHoleScoreText}>{currentHole.strokes === 0 ? "-" : currentHole.relativeToPar}</Text>}
            </View>
            <View style={styles.scoresCell}>
              {nextHole && <Text style={styles.scoresText}>{nextHole.strokes === 0 ? "-" : nextHole.relativeToPar}</Text>}
            </View>
          </View>
        );
      })}
    </GestureRecognizer>
  );
};

const styles = StyleSheet.create({
  scoresContainer: { flex: 1, padding: 5 },
  scoresRow: { flex: 5, flexDirection: "row" },
  scoresHeaderRow: { flex: 1, flexDirection: "row" },
  scoresCell: { flex: 2, justifyContent: "center", alignItems: "center" },
  scoresTotalCell: { flex: 1, justifyContent: "center", alignItems: "center" },
  currentScoresCell: { flex: 4, justifyContent: "center", alignItems: "center", borderRightWidth: 1, borderLeftWidth: 1, borderColor: "lightgrey" },
  currentHoleScoreText: { fontSize: 40 },
  scoresCellHead: { flex: 3, justifyContent: "center", alignItems: "center", flexDirection: "row" },
  scoresHeadText: {},
  scoresText: { fontSize: 12 },
});

export default PlayerScores;
