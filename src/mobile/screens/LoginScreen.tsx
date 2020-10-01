import { Input, Button } from "@jrobins/bulma-native";
import { StackScreenProps } from "@react-navigation/stack";
import * as React from "react";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { connect, ConnectedProps } from "react-redux";
import * as UserStore from "../store/User";
import { StackParamList } from "../types";

const connector = connect(null, UserStore.actionCreators);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {} & StackScreenProps<StackParamList, "Login">;

const LoginScreen = ({ navigation, requestLogin }: Props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.container}>
      <Input
        iconLeft="envelope"
        containerStyle={styles.input}
        value={username}
        onChangeText={(username) => setUsername(username)}
        autoCompleteType="username"
      />
      <Input
        iconLeft="lock"
        containerStyle={styles.input}
        value={password}
        onChangeText={(pw) => setPassword(pw)}
        autoCompleteType="password"
        secureTextEntry={true}
      />
      <Button onPress={() => requestLogin(username, password)}>Login</Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f2ffde",
  },
  input: { width: 200, padding: 5 },
});

export default connector(LoginScreen);
