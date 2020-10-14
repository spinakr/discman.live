import React from "react";
import { Image } from "react-native";

export interface DiscGolfBasketIconProps {
  size: number;
}

export default ({ size }: DiscGolfBasketIconProps) => {
  return (
    <Image source={require("../assets/images/noun_grass_1733135.png")} fadeDuration={0} style={{ width: size, height: size, borderRadius: 20 }} />
  );
};
