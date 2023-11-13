import React from "react";

export interface DiscGolfBasketIconProps {
  size: number;
}

export default ({ size }: DiscGolfBasketIconProps) => {
  return (
    <img
      src={"noun_grass_1733135.png"}
      style={{ width: size, height: size, borderRadius: 20 }}
    />
  );
};
