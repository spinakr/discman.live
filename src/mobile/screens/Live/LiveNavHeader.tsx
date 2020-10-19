import { FontAwesome5 } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { View } from "../../components/Themed";
import Colors from "../../constants/Colors";
import useColorScheme from "../../hooks/useColorScheme";

export interface LiveNavHeaderProps {
  activeScreen: string;
}

const LiveNavHeader = ({ activeScreen }: LiveNavHeaderProps) => {
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
      <View style={styles.rightContainer}>
        <TouchableOpacity
          style={styles.trigger}
          onPress={() => {
            nav.navigate("Register");
          }}
        >
          <MaterialIcons
            name="live-tv"
            size={30}
            color={activeScreen === "Register" ? Colors[scheme].tabIconSelected : Colors[scheme].tabIconDefault}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.trigger}
          onPress={() => {
            nav.navigate("Scorecard");
          }}
        >
          <FontAwesome5
            name="clipboard-list"
            size={30}
            color={activeScreen === "Scorecard" ? Colors[scheme].tabIconSelected : Colors[scheme].tabIconDefault}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: { height: 30, flex: 1, flexDirection: "row", paddingBottom: 15 },
  rightContainer: { flex: 1, flexDirection: "row", justifyContent: "flex-end" },
  trigger: {
    flex: 1,
    borderRadius: 50,
    marginLeft: 10,
    width: 50,
    height: 30,
  },
});

export default LiveNavHeader;
