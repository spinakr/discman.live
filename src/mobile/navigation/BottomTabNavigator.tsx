import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import * as UserStore from "../store/User";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import CreateRoundScreen from "../screens/CreateRoundScreen";
import DiscmanScreen from "../screens/DiscmanScreen";
import LiveScreen from "../screens/LiveScreen";
import { ApplicationState } from "../store";
import { HomeBottomTabParamList, PlayStackParamList } from "../types";
import SettingsScreen from "../screens/SettingsScreen";

const BottomTab = createBottomTabNavigator<HomeBottomTabParamList>();

const BottomTabNavigator = () => {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator initialRouteName="Play" tabBarOptions={{ activeTintColor: Colors[colorScheme].tint }}>
      <BottomTab.Screen
        name="Play"
        component={PlayContainer}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="ios-code" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Discman.live"
        component={DiscmanScreen}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="ios-code" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="ios-code" color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
};

function TabBarIcon(props: { name: string; color: string }) {
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
}

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
  return (
    <PlayStack.Navigator screenOptions={{}}>
      {activeRound ? (
        <PlayStack.Screen name="Live" component={LiveScreen} options={{ headerTitle: "Live" }} />
      ) : (
        <PlayStack.Screen name="CreateRound" component={CreateRoundScreen} options={{ headerTitle: "Create Round" }} />
      )}
    </PlayStack.Navigator>
  );
};

const PlayContainer = connector(PlayNavigator);

export default BottomTabNavigator;
