import { StrokeSpec } from "./store/Rounds";

export default {
  // navbar: "#cfe1b9",
  // background: "#e9f5db",
  // feedItem: "#cfe1b9",
  navbar: "#e9edc9",
  background: "#fefae0",
  table: "#faedcd",
  button: "#fefae0",
  field: "#faedcd",
  circle1: "#d8f3dc",
  circle2: "#cfe1b9",
  rough: "#40916c",
  fairway: "#74c69d",
  ob: "#e07a5f",
};

export const scoreColorStyle = (mark: number, specs: StrokeSpec[]) => {
  var style = "";
  switch (mark) {
    case 0:
      style += "";
      break;
    case -1:
    case -2:
    case -3:
      style += " under-par-cell";
      break;
    case 1:
      style += " bogey-cell";
      break;
    default:
      style += " dobble-cell";
      break;
  }
  if (specs && specs.some((s) => (s.outcome as unknown as number) === 2)) {
    style += " ob-cell";
  }

  return style;
};
