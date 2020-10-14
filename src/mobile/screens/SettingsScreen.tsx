import { StackScreenProps } from "@react-navigation/stack";
import * as React from "react";
import { StyleSheet, TouchableOpacity, FlatList, SectionList } from "react-native";
import { connect, ConnectedProps } from "react-redux";
import { ApplicationState } from "../store";
import { HomeBottomTabParamList } from "../types";
import * as UserStore from "../store/User";
import { View, Text } from "../components/Themed";
import useColorScheme from "../hooks/useColorScheme";
import Colors from "../constants/Colors";

const mapState = (state: ApplicationState) => {
  return {
    activeRound: state.user?.userDetails?.activeRound,
    user: state.user,
  };
};

const connector = connect(mapState, UserStore.actionCreators);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {} & StackScreenProps<HomeBottomTabParamList, "Settings">;

interface LinkItem {
  textLeft: string;
  textRight?: string;
  onPress: any;
  style: any;
}
interface LinkSection {
  title: string;
  data: LinkItem[];
}

const Item = ({ textLeft, textRight, onPress, style }: { textLeft: string; textRight?: string; onPress: any; style: any }) => (
  <TouchableOpacity onPress={onPress} style={styles.item}>
    <View style={styles.itemContainer}>
      <View style={styles.leftContainer}>
        <Text style={style}>{textLeft}</Text>
      </View>
      <View style={styles.rightContainer}>
        <Text style={style}>{textRight}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

const renderItem = ({ item }: { item: LinkItem }) => {
  return <Item textLeft={item.textLeft} textRight={item.textRight} onPress={() => item.onPress()} style={item.style} />;
};

const ItemSeparatorView = () => {
  const colorScheme = useColorScheme();
  return (
    <View
      style={{
        height: 0.5,
        width: "100%",
        // backgroundColor: "#080808",
        backgroundColor: Colors[colorScheme].text,
      }}
    />
  );
};

const SettingsScreen = ({ navigation, logout, user }: Props) => {
  const links: LinkSection[] = [
    {
      title: "User",
      data: [
        {
          textLeft: "Username",
          textRight: user?.user?.username,
          onPress: () => {},
          style: null,
        },
        {
          textLeft: "Score mode",
          textRight: user?.userDetails?.simpleScoring ? "Simple" : "Detailed",
          onPress: () => {},
          style: null,
        },
      ],
    },
    {
      title: "",
      data: [
        {
          textLeft: "",
          textRight: "Logout",
          onPress: logout,
          style: styles.logoutLink,
        },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      <SectionList
        sections={links}
        ItemSeparatorComponent={ItemSeparatorView}
        renderItem={renderItem}
        keyExtractor={(item) => item.textLeft}
        renderSectionHeader={({ section: { title } }) => <Text style={styles.header}>{title}</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 10,
  },
  itemContainer: {
    flex: 1,
    flexDirection: "row",
  },
  leftContainer: {
    flex: 1,
  },
  rightContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
  header: {
    padding: 10,
    fontSize: 20,
  },
  logoutLink: {
    color: "red",
    margin: -1,
  },
  item: {
    padding: 15,
    fontSize: 18,
    height: 44,
  },
});

export default connector(SettingsScreen);
