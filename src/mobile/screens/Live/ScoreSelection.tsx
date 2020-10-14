import * as React from "react";
import { View, Text } from "../../components/Themed";
import { StrokeOutcome } from "../../store/ActiveRound";
import { ScrollView, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import DiscgolfBasketIcon from "../../components/DiscgolfBasketIcon";
import { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { Foundation } from "@expo/vector-icons";
import GrassIcon from "../../components/GrassIcon";
import { AntDesign } from "@expo/vector-icons";

export interface ScoreSelectionProps {
  saveScore: (strokes: StrokeOutcome[]) => void;
}

const outcomeIcon = (outcome: StrokeOutcome, size: number) => {
  switch (outcome) {
    case "Rough":
      return <Foundation name="trees" size={size} color="black" />;
    case "Fairway":
      return <GrassIcon size={size} />;
    case "OB":
      return <Text style={{ ...styles.scoreText, fontSize: size }}>OB</Text>;
    case "Circle1":
      return <MaterialCommunityIcons name="circle-double" size={size} color="black" />;
    case "Circle2":
      return <Feather name="circle" size={size} color="black" />;
    case "Basket":
      return <DiscgolfBasketIcon size={size} />;
  }
};

const ScoreSelection = ({ saveScore }: ScoreSelectionProps) => {
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

  const renderSelectedMarks = () => {
    const last8Marks = strokes.slice(-8);
    return (
      <View style={styles.selectedScoresContainer}>
        {last8Marks.map((s, i) => (
          <React.Fragment key={i}>
            <TouchableOpacity onPress={() => setStrokes([...strokes.filter((e, i) => i !== strokes.length - 1)])} key={s}>
              {outcomeIcon(s, s === "Fairway" ? 50 : 40)}
            </TouchableOpacity>
            {i !== last8Marks.length - 1 && <AntDesign name="arrowright" size={20} color="black" style={{ padding: 10 }} />}
          </React.Fragment>
        ))}
      </View>
    );
  };

  return (
    <>
      <View style={styles.selectorContainer}>
        <View style={styles.selectedScoresRow}>
          {showDescriptions ? (
            <Text style={styles.helpText}>Click the icons to register your strokes, the score is saved when you click the basket button.</Text>
          ) : (
            renderSelectedMarks()
          )}
        </View>
        <View style={styles.helpTextContainer}>
          <TouchableOpacity onPressOut={() => setShowDescriptions(false)} onPressIn={() => setShowDescriptions(true)}>
            <Text style={styles.helpTextClickable}>What is this?</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.scoreSelectorRow}>
          {renderSelectorButton(outcomeIcon("Rough", 50), "Rough / \nnot where intended", "Rough")}
          {renderSelectorButton(outcomeIcon("Circle2", 50), "Circle 2 / \ninside 20 meters", "Circle2")}
          {renderSelectorButton(outcomeIcon("OB", 40), "Out-of-bounds \n", "OB")}
        </View>
        <View style={styles.scoreSelectorRow}>
          {renderSelectorButton(outcomeIcon("Fairway", 100), "Fairway / \nclear path to basket", "Fairway")}
          {renderSelectorButton(outcomeIcon("Circle1", 60), "Circle 1 / \ninside 10 meters", "Circle1")}
          {renderSelectorButton(outcomeIcon("Basket", 100), "In the basket!", "Basket")}
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
  helpTextContainer: { alignSelf: "flex-end", paddingRight: 10 },
  helpText: { padding: 10, fontSize: 20 },
  helpTextClickable: { textDecorationLine: "underline" },
  selectedScoresRow: {
    flex: 1,
  },
  selectedScoresContainer: { flex: 1, flexDirection: "row", flexWrap: "wrap", padding: 5 },
  scoreSelectorRow: {
    flex: 1,
    margin: 5,
    flexDirection: "row",
  },
});

export default ScoreSelection;
