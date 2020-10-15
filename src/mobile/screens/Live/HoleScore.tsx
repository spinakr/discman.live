import * as React from "react";
import { View, Text } from "../../components/Themed";
import { HoleScore, Round, StrokeSpec } from "../../store/ActiveRound";
import { StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import SelectedScoreMarks from "./SelectedScoreMarks";
import { StrokeOutcome } from "../../store/ActiveRound";
import Colors from "../../constants/Colors";
import useColorScheme from "../../hooks/useColorScheme";

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

const mapStrokesOutcomeInt = (outcomeString: number) => {
  switch (outcomeString) {
    case 0:
      return "Fairway" as StrokeOutcome;
    case 1:
      return "Rough" as StrokeOutcome;
    case 2:
      return "OB" as StrokeOutcome;
    case 3:
      return "Circle2" as StrokeOutcome;
    case 4:
      return "Circle1" as StrokeOutcome;
    case 5:
      return "Basket" as StrokeOutcome;
    default:
      return "Basket";
  }
};

const HoleScoreComp = ({ holeScore, setEdit }: HoleScoreProps) => {
  const scheme = useColorScheme();
  const strokeOutcomes: StrokeOutcome[] = holeScore.strokeSpecs.map((s) => mapStrokesOutcomeInt(+s.outcome));
  return (
    <View style={styles.container}>
      <View style={styles.selectedView}>
        <SelectedScoreMarks strokes={strokeOutcomes} onIconClicked={() => {}} />
      </View>
      <View style={styles.changeView}>
        <Text style={styles.scoreText}>{scoreText(holeScore)}</Text>
        <Feather name="edit" size={30} color={Colors[scheme].tabIconDefault} onPress={() => setEdit(true)} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 5, justifyContent: "center", alignItems: "center", flexDirection: "column" },
  selectedView: { flex: 1 },
  scoreText: { fontSize: 70, paddingRight: 15 },
  changeText: { fontSize: 10 },
  changeView: { flex: 3, flexDirection: "row", alignItems: "center" },
});

export default HoleScoreComp;
