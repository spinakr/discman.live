import * as Linking from "expo-linking";

export default {
  prefixes: [Linking.makeUrl("/")],
  config: {
    screens: {
      Login: "Login",
      Home: {
        screens: {
          Discman: "Discman",
          Play: {
            screens: {
              CreateRound: "CreateRound", 
              Live: "Live" 
            }
          },
        },
      },
      NotFound: "*",
    },
  },
};
