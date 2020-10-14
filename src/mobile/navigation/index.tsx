import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { ColorSchemeName, SafeAreaView, StyleSheet } from "react-native";
import * as UserStore from "../store/User";
import NotFoundScreen from "../screens/NotFoundScreen";
import { StackParamList } from "../types";
import BottomTabNavigator from "./DrawerNavigation";
import LinkingConfiguration from "./LinkingConfiguration";
import { ApplicationState } from "../store";
import { connect, ConnectedProps } from "react-redux";
import LoginScreen from "../screens/LoginScreen";
import AuthLoadingScreen from "../screens/AuthLoadingScreen";
import { StatusBar } from "react-native";
import NavHeader from "./NavHeader";

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
  return (
    <SafeAreaView style={styles.container}>
      <NavigationContainer linking={LinkingConfiguration} theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack.Navigator screenOptions={{ header: () => <NavHeader /> }} initialRouteName="Login">
          {user?.loggedIn ? (
            <>
              <Stack.Screen name="Home" component={BottomTabNavigator} />
              <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: "Oops!" }} />
            </>
          ) : (
            <>
              {/* <Stack.Screen name="AuthLoading" component={AuthLoadingScreen} /> */}
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
    marginTop: StatusBar.currentHeight || 0,
  },
});

export default connector(Navigation);
