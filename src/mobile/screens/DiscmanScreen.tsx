import { StackScreenProps } from "@react-navigation/stack";
import { WebView } from "react-native-webview";
import * as React from "react";
import { StyleSheet } from "react-native";
import { StackParamList } from "../types";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DiscmanScreen({}: StackScreenProps<StackParamList, "Discman">) {
  const injectedCode = () => {
    const token =
      '{"username":"akofoed","token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6ImFrb2ZvZWQiLCJuYmYiOjE2MDA4NTU0MTIsImV4cCI6MTYzMjM5MTQxMiwiaWF0IjoxNjAwODU1NDEyfQ.E2tDs4Gt-_T0pNDPZog4N5x8UPftasht63qR-LsvVoQ","email":"anders.kfd@gmail.com"}';

    return `
        var storedToken = localStorage.getItem('user');
        console.log('injected!!!')
        if (!storedToken || storedToken !== '${token}') {
          localStorage.setItem('user', '${token}');
          location.reload();
        }
    `;
  };

  return (
    <SafeAreaView style={{ flex:1 }}>
      <WebView
        source={{ uri: "http://localhost:5000/?nonav=1" }}
        javaScriptEnabled={true}
        injectedJavaScript={injectedCode()}
        domStorageEnabled={true}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
