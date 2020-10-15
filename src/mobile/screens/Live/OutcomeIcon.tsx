import * as React from "react";
import { Text } from "../../components/Themed";
import { StrokeOutcome } from "../../store/ActiveRound";
import { StyleSheet } from "react-native";
import { Foundation } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import DiscgolfBasketIcon from "../../components/DiscgolfBasketIcon";
import useColorScheme from "../../hooks/useColorScheme";
import Colors from "../../constants/Colors";

export interface OutcomeIconProps {
  outcome: StrokeOutcome;
  size: number;
}
const OutcomeIcon = ({ outcome, size }: OutcomeIconProps) => {
  const scheme = useColorScheme();
  switch (outcome) {
    case "Rough":
      return <Foundation name="trees" size={size} color={Colors[scheme].tabIconDefault} />;
    case "Fairway":
      return <FontAwesome name="road" size={size} color={Colors[scheme].tabIconDefault} />;
    case "OB":
      return <Text style={{ ...styles.scoreText, fontSize: size - 5 }}>OB</Text>;
    case "Circle1":
      return <MaterialCommunityIcons name="circle-double" size={size} color={Colors[scheme].tabIconDefault} />;
    case "Circle2":
      return <Feather name="circle" size={size} color={Colors[scheme].tabIconDefault} />;
    case "Basket":
      return <DiscgolfBasketIcon size={size + 20} color={Colors[scheme].tabIconDefault} />;
    default:
      return null;
  }
};

const styles = StyleSheet.create({
  scoreText: { fontWeight: "500", fontSize: 40 },
});

export default OutcomeIcon;
