import * as React from "react";
import { View, Text } from "../../components/Themed";
import { HoleScore, PlayerCourseStats, PlayerScore, Round, StrokeSpec } from "../../store/ActiveRound";
import { StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import SelectedScoreMarks from "./SelectedScoreMarks";
import { StrokeOutcome } from "../../store/ActiveRound";
import Colors from "../../constants/Colors";
import useColorScheme from "../../hooks/useColorScheme";

export interface HoleScoreProps {
  playerScores: PlayerScore[];
  activeHoleIndex: number;
  username: string;
  setEdit: React.Dispatch<React.SetStateAction<boolean>>;
  playerCourseStats: PlayerCourseStats | undefined;
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

const HoleScoreComp = ({ playerScores, username, activeHoleIndex, setEdit, playerCourseStats }: HoleScoreProps) => {
  const currentPlayerScores = playerScores.find((p) => p.playerName === username)?.scores;
  if (!currentPlayerScores) return null;
  const currentPlayerHoleScore = currentPlayerScores[activeHoleIndex];
  const scheme = useColorScheme();
  const strokeOutcomes: StrokeOutcome[] = currentPlayerHoleScore.strokeSpecs.map((s) => mapStrokesOutcomeInt(+s.outcome));
  const putDistance = currentPlayerHoleScore.strokeSpecs.find((s) => s.putDistance)?.putDistance;

  const currentScore = currentPlayerScores.reduce((total, score) => {
    return total + score.relativeToPar;
  }, 0);

  const lastScoredHoleIndex = currentPlayerScores.map((s) => s.strokes).lastIndexOf(0) - 1;

  const currentAverage = playerCourseStats?.averagePrediction[lastScoredHoleIndex];

  const versusAverage = Math.ceil((currentScore || 0) - (currentAverage || 0));

  return (
    <View style={styles.container}>
      <View style={styles.selectedView}>
        <SelectedScoreMarks strokes={strokeOutcomes} putDistance={putDistance} onIconClicked={() => {}} />
      </View>
      <View style={styles.changeView}>
        <Text style={styles.scoreText}>{scoreText(currentPlayerHoleScore)}</Text>
        <Feather name="edit" size={30} color={Colors[scheme].tabIconDefault} onPress={() => setEdit(true)} />
      </View>
      <View style={styles.roundStatusView}>
        {playerCourseStats && (
          <View>
            <Text>
              You are{" "}
              <Text style={styles.averageText}>
                {Math.abs(versusAverage)} {versusAverage < 0 ? "ahead of" : "behind"}
              </Text>{" "}
              your average score{" "}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  averageText: { fontSize: 25 },
  container: { flex: 1, padding: 5, justifyContent: "center", alignItems: "center", flexDirection: "column" },
  selectedView: { flex: 1 },
  scoreText: { fontSize: 50, paddingRight: 15 },
  changeText: { fontSize: 10 },
  changeView: { flex: 2, flexDirection: "row", alignItems: "center" },
  roundStatusView: { flex: 3 },
});

export default HoleScoreComp;
