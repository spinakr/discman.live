import React from "react";
import { Image } from "react-native";

export interface DiscGolfBasketIconProps {
  size: number;
  color: string;
}

export default ({ size, color }: DiscGolfBasketIconProps) => {
  return (
    <Image
      source={require("../assets/images/discgolfbasket_1200x1200.png")}
      fadeDuration={0}
      style={{ width: size, height: size, borderRadius: 50, tintColor: color }}
    />
  );
};
