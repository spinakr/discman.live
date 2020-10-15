import * as React from "react";
import { View, Text } from "../../components/Themed";
import { StrokeOutcome } from "../../store/ActiveRound";
import { StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useState } from "react";
import SelectedScoreMarks from "./SelectedScoreMarks";
import OutcomeIcon from "./OutcomeIcon";

export interface ScoreSelectionProps {
  saveScore: (strokes: StrokeOutcome[]) => void;
  cancelEdit: (() => void) | null;
}

const ScoreSelection = ({ saveScore, cancelEdit }: ScoreSelectionProps) => {
  const [showDescriptions, setShowDescriptions] = useState(false);
  const [strokes, setStrokes] = useState<StrokeOutcome[]>([]);

  const renderSelectorButton = (selectorItem: React.ReactElement, description: string, outcome: StrokeOutcome) => {
    return (
      <TouchableOpacity
        style={styles.scoreSelector}
        onPress={() => {
          if (outcome === "Basket") {
            saveScore([...strokes, "Basket"]);
            setStrokes([]);
          } else {
            setStrokes([...strokes, outcome]);
          }
        }}
      >
        {showDescriptions ? (
          <View style={styles.scoreDescriptionContainer}>
            <View style={styles.scoreDescriptionItem}>
              <Text style={styles.scoreDescriptionText}>{description}</Text>
            </View>
            <View style={styles.scoreDescriptionItem}>{selectorItem}</View>
          </View>
        ) : (
          selectorItem
        )}
      </TouchableOpacity>
    );
  };

  return (
    <>
      <View style={styles.selectorContainer}>
        <View style={styles.selectedScoresRow}>
          {showDescriptions ? (
            <Text style={styles.helpText}>Click the icons to register your strokes, the score is saved when you click the basket button.</Text>
          ) : (
            <SelectedScoreMarks strokes={strokes} onIconClicked={() => setStrokes([...strokes.filter((e, i) => i !== strokes.length - 1)])} />
          )}
        </View>
        <View style={styles.helpTextContainer}>
          {cancelEdit ? (
            <TouchableOpacity onPress={() => cancelEdit()}>
              <Text style={styles.helpTextClickable}>Cancel edit</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPressOut={() => setShowDescriptions(false)} onPressIn={() => setShowDescriptions(true)}>
              <Text style={styles.helpTextClickable}>What is this?</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.scoreSelectorRow}>
          {renderSelectorButton(<OutcomeIcon outcome="Rough" size={50} />, "Rough: \nnot where intended", "Rough")}
          {renderSelectorButton(<OutcomeIcon outcome="Circle2" size={50} />, "Circle 2: \ninside 20 meters", "Circle2")}
          {renderSelectorButton(<OutcomeIcon outcome="OB" size={50} />, "Out-of-bounds \n", "OB")}
        </View>
        <View style={styles.scoreSelectorRow}>
          {renderSelectorButton(<OutcomeIcon outcome="Fairway" size={50} />, "Fairway:  \nclear path to basket", "Fairway")}
          {renderSelectorButton(<OutcomeIcon outcome="Circle1" size={60} />, "Circle 1  \ninside 10 meters", "Circle1")}
          {renderSelectorButton(<OutcomeIcon outcome="Basket" size={90} />, "In the basket!", "Basket")}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  selectorContainer: { flex: 1, alignItems: "center" },
  scoreSelector: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "grey",
    margin: 10,
    aspectRatio: 1,
    borderRadius: 10,
    borderWidth: 3,
    overflow: "hidden",
  },
  scoreText: { fontWeight: "500", fontSize: 40 },
  scoreDescriptionText: {},
  scoreDescriptionContainer: { flex: 1, flexDirection: "column", alignItems: "center", margin: 2, overflow: "hidden" },
  scoreDescriptionItem: {},
  helpTextContainer: { flexDirection: "row", alignSelf: "flex-end", paddingRight: 10 },
  helpText: { padding: 10, fontSize: 20 },
  helpTextClickable: { textDecorationLine: "underline" },
  selectedScoresRow: {
    flex: 1,
  },
  selectedScoresContainer: { flex: 1, flexDirection: "row", padding: 3, alignItems: "center" },
  scoreSelectorRow: {
    flex: 1,
    margin: 5,
    flexDirection: "row",
  },
});

export default ScoreSelection;
