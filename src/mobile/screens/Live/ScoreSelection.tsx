import * as React from "react";
import { View, Text } from "../../components/Themed";
import { StrokeOutcome } from "../../store/ActiveRound";
import { Alert, Modal, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useState } from "react";
import SelectedScoreMarks from "./SelectedScoreMarks";
import OutcomeIcon from "./OutcomeIcon";
import Slider from "@react-native-community/slider";

export interface ScoreSelectionProps {
  saveScore: (strokes: StrokeOutcome[], putDistance?: number) => void;
  cancelEdit: (() => void) | null;
  registerPutDistance: boolean;
}

const ScoreSelection = ({ saveScore, cancelEdit, registerPutDistance }: ScoreSelectionProps) => {
  const [showDescriptions, setShowDescriptions] = useState(false);
  const [strokes, setStrokes] = useState<StrokeOutcome[]>([]);
  const [tmpPutDistance, setTmpPutDistance] = useState(0);
  const [showPutDistanceSelector, setShowPutDistanceSelector] = useState(false);
  const completeScore = (putDistance?: number) => {
    saveScore([...strokes, "Basket"], putDistance);
    setStrokes([]);
    setShowPutDistanceSelector(false);
  };
  const renderSelectorButton = (selectorItem: React.ReactElement, description: string, outcome: StrokeOutcome) => {
    return (
      <TouchableOpacity
        style={styles.scoreSelector}
        onPress={() => {
          if (outcome === "Basket") {
            if (registerPutDistance) {
              setShowPutDistanceSelector(true);
            } else {
              completeScore();
            }
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
      <Modal animationType="slide" transparent={true} visible={showPutDistanceSelector}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.headerText}>Approximate put distance</Text>
            <Text>{tmpPutDistance} meters</Text>
            <View style={styles.sliderView}>
              <Slider
                style={{ flex: 1, height: 40 }}
                minimumValue={0}
                maximumValue={10}
                minimumTrackTintColor="#FFFFFF"
                maximumTrackTintColor="#000000"
                step={1}
                onSlidingComplete={(value: number) => {
                  setShowPutDistanceSelector(false);
                  completeScore(value);
                }}
                onValueChange={(value: number) => setTmpPutDistance(value)}
              />
            </View>
          </View>
        </View>
      </Modal>
      <View style={styles.container}>
        <View style={styles.discSelectorContainer}></View>
        <View style={styles.selectedScoresRow}>
          <SelectedScoreMarks
            strokes={strokes}
            onIconClicked={() => setStrokes([...strokes.filter((e, i) => i !== strokes.length - 1)])}
            putDistance={undefined}
          />
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
        <View style={styles.scoreSelectorContainer}>
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
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  discSelectorContainer: { flex: 2 },
  scoreSelector: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "grey",
    margin: 10,
    aspectRatio: 1,
    maxHeight: 110,
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
    alignItems: "center",
  },
  selectedScoresContainer: { flex: 1, flexDirection: "row", padding: 3, alignItems: "center" },
  scoreSelectorContainer: { flex: 4 },
  scoreSelectorRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    backgroundColor: "#00000080",
  },
  modalView: {
    margin: 20,
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sliderView: { flex: 1, maxHeight: 40, flexDirection: "row" },
  headerText: { fontSize: 18, paddingBottom: 30 },
});

export default ScoreSelection;
