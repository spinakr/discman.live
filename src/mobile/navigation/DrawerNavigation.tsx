import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import * as UserStore from "../store/User";
import CreateRoundScreen from "../screens/CreateRoundScreen";
import DiscmanScreen from "../screens/DiscmanScreen";
import { ApplicationState } from "../store";
import { HomeBottomTabParamList, PlayStackParamList } from "../types";
import SettingsScreen from "../screens/SettingsScreen";
import reconnectToHubOnAppStateChange from "../hooks/dispatchAppStateChanges";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useFocusEffect } from "@react-navigation/native";
import LiveScreen2 from "../screens/Live/LiveScreen2";
import CommonNavHeader from "./CommonNavHeader";
import LiveScreen from "../screens/Live/LiveScreen";
import LiveScreen3 from "../screens/Live/LiveScreen3";

const Drawer = createDrawerNavigator<HomeBottomTabParamList>();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator initialRouteName="Play">
      <Drawer.Screen name="Play" component={PlayContainer} />
      <Drawer.Screen name="Discman.live" component={DiscmanScreen} options={{}} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
    </Drawer.Navigator>
  );
};
// const BottomTabNavigator = () => {
//   const colorScheme = useColorScheme();

//   return (
//     <BottomTab.Navigator initialRouteName="Play" tabBarOptions={{ activeTintColor: Colors[colorScheme].tint }}>
//       <BottomTab.Screen
//         name="Play"
//         component={PlayContainer}
//         options={{
//           tabBarIcon: ({ color }) => <MaterialIcons size={30} style={{ marginBottom: -3, color: color }} name="live-tv" />,
//         }}
//       />
//       <BottomTab.Screen
//         name="Discman.live"
//         component={DiscmanScreen}
//         options={{
//           tabBarIcon: ({ color }) => <MaterialCommunityIcons size={30} style={{ marginBottom: -3, color: color }} name="web" />,
//         }}
//       />
//       <BottomTab.Screen
//         name="Settings"
//         component={SettingsScreen}
//         options={{
//           tabBarIcon: ({ color }) => <Ionicons size={30} style={{ marginBottom: -3, color: color }} name="md-settings" />,
//         }}
//       />
//     </BottomTab.Navigator>
//   );
// };

const PlayStack = createStackNavigator<PlayStackParamList>();
const mapState = (state: ApplicationState) => {
  return {
    activeRound: state.user?.userDetails?.activeRound,
    username: state.user?.user?.username,
  };
};

const connector = connect(mapState, UserStore.actionCreators);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {};

const PlayNavigator = ({ activeRound, fetchUserDetails, username }: Props) => {
  useEffect(() => {
    username && fetchUserDetails();
  }, [username]);
  reconnectToHubOnAppStateChange();

  useFocusEffect(() => {
    fetchUserDetails();
  });
  return (
    <PlayStack.Navigator screenOptions={{}}>
      {activeRound ? (
        <PlayStack.Screen name="Live" component={LiveScreen3} options={{ headerShown: false }} />
      ) : (
        <PlayStack.Screen name="CreateRound" component={CreateRoundScreen} options={{ headerTitle: "Create Round" }} />
      )}
    </PlayStack.Navigator>
  );
};

const PlayContainer = connector(PlayNavigator);

export default DrawerNavigator;
