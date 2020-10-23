import { Input, Button } from "@jrobins/bulma-native";
import { StackScreenProps } from "@react-navigation/stack";
import * as React from "react";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { connect, ConnectedProps } from "react-redux";
import DiscgolfBasketIcon from "../components/DiscgolfBasketIcon";
import { View, Text } from "../components/Themed";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import { ApplicationState } from "../store";
import * as UserStore from "../store/User";
import { StackParamList } from "../types";

const mapState = (state: ApplicationState) => {
  return {
    loggedIn: state.user?.loggedIn,
  };
};
const connector = connect(mapState, UserStore.actionCreators);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {} & StackScreenProps<StackParamList, "Login">;

const LoginScreen = ({ navigation, requestLogin, loadLogginInfo, loggedIn, createUser }: Props) => {
  useEffect(() => {
    if (!loggedIn) {
      loadLogginInfo();
    }
  }, []);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const scheme = useColorScheme();
  return (
    <View style={{ ...styles.container }}>
      <View style={{ ...styles.infoView, backgroundColor: Colors[scheme].appColor }}>
        <DiscgolfBasketIcon size={150} color={Colors[scheme].tabIconDefault} />
        <Text style={styles.logoText}>Discman</Text>
      </View>
      <View style={styles.inputView}>
        <Input
          iconLeft="envelope"
          containerStyle={styles.input}
          value={username}
          onChangeText={(username) => setUsername(username)}
          autoCompleteType="username"
          placeholder="Username"
        />
        <Input
          iconLeft="lock"
          containerStyle={styles.input}
          value={password}
          onChangeText={(pw) => setPassword(pw)}
          autoCompleteType="password"
          secureTextEntry={true}
          placeholder="Password"
        />
        <View style={styles.buttonView}>
          <Button style={styles.button} onPress={() => requestLogin(username, password)} disabled={username.length < 3}>
            Login
          </Button>
          <Button style={styles.button} onPress={() => createUser(username, password)} disabled={username.length < 3 || password.length < 6}>
            Register
          </Button>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  infoView: { flex: 3, flexDirection: "row", alignItems: "center" },
  logoText: { fontFamily: "space-mono", fontSize: 50 },
  inputView: {
    flex: 2,
    alignItems: "stretch",
    padding: 30,
  },
  buttonView: { flexDirection: "row", padding: 5, justifyContent: "space-between" },
  button: { flex: 1, maxWidth: 100 },
  input: { padding: 5 },
});

export default connector(LoginScreen);
