import * as React from "react";
import { View } from "../../components/Themed";
import { StrokeOutcome } from "../../store/ActiveRound";
import { StyleSheet, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import OutcomeIcon from "./OutcomeIcon";
import useColorScheme from "../../hooks/useColorScheme";
import Colors from "../../constants/Colors";

export interface SelectedScoreMarksProps {
  strokes: StrokeOutcome[];
  onIconClicked: () => void;
}

const SelectedScoreMarks = ({ strokes, onIconClicked }: SelectedScoreMarksProps) => {
  const last9Marks = strokes.slice(-9);
  const scheme = useColorScheme();
  return (
    <View style={styles.selectedScoresContainer}>
      {last9Marks.map((s, i) => (
        <React.Fragment key={i}>
          <TouchableOpacity onPress={() => onIconClicked()} key={s}>
            <OutcomeIcon outcome={s} size={20} />
          </TouchableOpacity>
          {s !== "Basket" && <AntDesign name="arrowright" size={10} color={Colors[scheme].tabIconDefault} style={{ padding: 5 }} />}
        </React.Fragment>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  selectedScoresContainer: { flex: 1, flexDirection: "row", padding: 3, alignItems: "center" },
  scoreText: { fontWeight: "500", fontSize: 40 },
});

export default SelectedScoreMarks;
