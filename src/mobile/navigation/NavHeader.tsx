import { DrawerActions, useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { View, Text } from "../components/Themed";
import { MaterialIcons } from "@expo/vector-icons";
import useColorScheme from "../hooks/useColorScheme";
import Colors from "../constants/Colors";

const NavHeader = () => {
  const nav = useNavigation();
  const scheme = useColorScheme();
  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.trigger}
        onPress={() => {
          nav.dispatch(DrawerActions.toggleDrawer());
        }}
      >
        <MaterialIcons name="menu" size={30} color={Colors[scheme].tabIconDefault} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: { height: 30, margin: 0 },
  trigger: {
    borderRadius: 50,
    marginLeft: 10,
    width: 50,
    height: 30,
  },
});

export default NavHeader;
