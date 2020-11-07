import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { ColorSchemeName, SafeAreaView, StyleSheet } from "react-native";
import * as UserStore from "../store/User";
import NotFoundScreen from "../screens/NotFoundScreen";
import { StackParamList } from "../types";
import DrawerNavigator from "./DrawerNavigation";
import { ApplicationState } from "../store";
import { connect, ConnectedProps } from "react-redux";
import LoginScreen from "../screens/LoginScreen";
import { StatusBar } from "react-native";
import Colors from "../constants/Colors";

const Stack = createStackNavigator<StackParamList>();

const mapState = (state: ApplicationState) => {
  return {
    user: state.user,
  };
};

const connector = connect(mapState, UserStore.actionCreators);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  colorScheme: ColorSchemeName;
};

const Navigation = ({ colorScheme, user }: Props) => {
  const theme = colorScheme === "dark" ? DarkTheme : DefaultTheme;
  return (
    <SafeAreaView style={{ ...styles.container, backgroundColor: Colors[colorScheme === "dark" ? "dark" : "light"].background }}>
      <NavigationContainer theme={theme}>
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Login">
          {user?.loggedIn ? (
            <>
              <Stack.Screen name="Home" component={DrawerNavigator} />
              <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: "Oops!" }} />
            </>
          ) : (
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: (StatusBar.currentHeight || 0) + 30,
  },
});

export default connector(Navigation);
