import { DrawerActions, useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { View, Text } from "../components/Themed";
import { MaterialIcons } from "@expo/vector-icons";
import useColorScheme from "../hooks/useColorScheme";
import Colors from "../constants/Colors";

export interface CommonNavHeaderProps {
  title?: string;
}

const CommonNavHeader = ({ title }: CommonNavHeaderProps) => {
  const nav = useNavigation();
  const scheme = useColorScheme();
  return (
    <View style={styles.header}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.trigger}
          onPress={() => {
            nav.dispatch(DrawerActions.toggleDrawer());
          }}
        >
          <MaterialIcons name="menu" size={30} color={Colors[scheme].tabIconDefault} />
        </TouchableOpacity>
        <Text style={styles.titleText}>{title}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  titleText: { fontSize: 18 },
  container: { flex: 1, flexDirection: "row", alignItems: "center" },
  header: { height: 50, backgroundColor: "yellow" },
  rightContainer: { flex: 1, flexDirection: "row", justifyContent: "flex-end" },
  trigger: {
    flex: 1,
    marginLeft: 10,
  },
});

export default CommonNavHeader;
