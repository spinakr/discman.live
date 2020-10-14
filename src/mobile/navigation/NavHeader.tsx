import { DrawerActions, useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { View, Text } from "../components/Themed";
import { MaterialIcons } from "@expo/vector-icons";

const NavHeader = () => {
  const nav = useNavigation();
  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.trigger}
        onPress={() => {
          nav.dispatch(DrawerActions.toggleDrawer());
        }}
      >
        <MaterialIcons name="menu" size={30} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: { height: 50, paddingTop: 10, margin: 0 },
  trigger: {
    borderRadius: 50,
    marginLeft: 10,
    width: 50,
    height: 50,
  },
});

export default NavHeader;
