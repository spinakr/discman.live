import * as React from "react";
import { View, Text } from "../../components/Themed";
import { ScrollView, StyleSheet } from "react-native";

export interface DiscSelectionProps {}
const DiscSelection = ({}: DiscSelectionProps) => {
  return (
    <ScrollView contentContainerStyle={{}} horizontal={true}>
      <View style={{ ...styles.discSelector, backgroundColor: "white" }}>
        <Text style={{ fontWeight: "bold" }}>Wraith</Text>
      </View>
      <View style={{ ...styles.discSelector, backgroundColor: "blue" }}>
        <Text style={{ fontWeight: "bold" }}>Wraith</Text>
      </View>
      <View style={{ ...styles.discSelector, backgroundColor: "blue" }}>
        <Text>TB3</Text>
      </View>
      <View style={styles.discSelector}>
        <Text>TB3</Text>
      </View>
      <View style={styles.discSelector}>
        <Text>TB3</Text>
      </View>
      <View style={styles.discSelector}>
        <Text>TB3</Text>
      </View>
      <View style={styles.discSelector}>
        <Text>TB3</Text>
      </View>
      <View style={styles.discSelector}>
        <Text>TB3</Text>
      </View>
      <View style={styles.discSelector}>
        <Text>TB3</Text>
      </View>
      <View style={styles.discSelector}>
        <Text>TB3</Text>
      </View>
      <View style={styles.discSelector}>
        <Text>TB3</Text>
      </View>
      <View style={styles.discSelector}>
        <Text>TB3</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  discSelector: {
    flex: 1,
    width: 75,
    height: 75,
    margin: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    borderWidth: 1,
  },
});

export default DiscSelection;
