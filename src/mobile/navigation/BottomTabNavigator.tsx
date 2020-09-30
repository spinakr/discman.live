import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";

import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import CreateRoundScreen from "../screens/CreateRoundScreen";
import DiscmanScreen from "../screens/DiscmanScreen";
import LiveScreen from "../screens/LiveScreen";
import { HomeBottomTabParamList, PlayStackParamList } from "../types";

const BottomTab = createBottomTabNavigator<HomeBottomTabParamList>();

export default function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator initialRouteName="Play" tabBarOptions={{ activeTintColor: Colors[colorScheme].tint }}>
      <BottomTab.Screen
        name="Play"
        component={PlayNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="ios-code" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Discman.Live"
        component={DiscmanScreen}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="ios-code" color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
}
// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon(props: { name: string; color: string }) {
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
}

const PlayStack = createStackNavigator<PlayStackParamList>();

function PlayNavigator() {
  return (
    <PlayStack.Navigator initialRouteName="CreateRound">
      <PlayStack.Screen
        name="Live"
        component={LiveScreen}
        options={{ headerTitle: 'Play Title' }}
      />
      <PlayStack.Screen
        name="CreateRound"
        component={CreateRoundScreen}
        options={{ headerTitle: 'Create Round Title' }}
      />
    </PlayStack.Navigator>
  );
}
