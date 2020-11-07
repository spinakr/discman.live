import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import * as UserStore from "../store/User";
import CreateRoundScreen from "../screens/CreateRoundScreen";
import DiscmanScreen from "../screens/DiscmanScreen";
import RoundsScreen from "../screens/Rounds/RoundsScreen";
import { ApplicationState } from "../store";
import { HomeBottomTabParamList, PlayStackParamList } from "../types";
import SettingsScreen from "../screens/SettingsScreen";
import reconnectToHubOnAppStateChange from "../hooks/dispatchAppStateChanges";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useFocusEffect } from "@react-navigation/native";
import LiveScreen from "../screens/Live/LiveScreen";

const Drawer = createDrawerNavigator<HomeBottomTabParamList>();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator initialRouteName="Play">
      <Drawer.Screen name="Play" component={PlayContainer} />
      <Drawer.Screen name="Rounds" component={RoundsScreen} />
      <Drawer.Screen name="Discman.live" component={DiscmanScreen} options={{}} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
    </Drawer.Navigator>
  );
};

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
        <PlayStack.Screen name="Live" component={LiveScreen} options={{ headerShown: false }} />
      ) : (
        <PlayStack.Screen name="CreateRound" component={CreateRoundScreen} options={{ headerShown: false }} />
      )}
    </PlayStack.Navigator>
  );
};

const PlayContainer = connector(PlayNavigator);

export default DrawerNavigator;
