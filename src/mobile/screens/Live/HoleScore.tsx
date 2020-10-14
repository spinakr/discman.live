import * as React from "react";
import { View, Text } from "../../components/Themed";
import { HoleScore, Round } from "../../store/ActiveRound";
import { StyleSheet } from "react-native";

export interface HoleScoreProps {
  holeScore: HoleScore;
  setEdit: React.Dispatch<React.SetStateAction<boolean>>;
}

const scoreText = (holeScore: HoleScore) => {
  if (holeScore.strokes === 1) return "Ace";
  switch (holeScore.relativeToPar) {
    case 0:
      return "Par";
    case -1:
      return "Birdie";
    case -2:
      return "Eagle";
    case 1:
      return "Bogey";
    case 2:
      return "Double Bogey";
    case 3:
      return "Triple Bogey";
    case 4:
      return "Quadruple Bogey";
    default:
      return "+" + holeScore.relativeToPar;
  }
};

const HoleScoreComp = ({ holeScore, setEdit }: HoleScoreProps) => {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.scoreText}>{scoreText(holeScore)}</Text>
      </View>
      <View style={styles.changeView}>
        <Text style={styles.changeText} onPress={() => setEdit(true)}>
          Change score
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 5, justifyContent: "center", alignItems: "center", flexDirection: "column" },
  scoreText: { fontSize: 80 },
  changeText: { fontSize: 10 },
  changeView: {},
});

export default HoleScoreComp;
