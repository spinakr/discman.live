import * as React from "react";
import NavMenu from "./NavMenu";
import Notifications from "./Notifications";
import Banner from "./Banner";
import colors from "../colors";

export default (props: { children?: React.ReactNode }) => (
  <div
    className="pb-2"
    style={{ backgroundColor: colors.background, height: "100%" }}
  >
    <Banner />
    <Notifications />
    {props.children}
    <NavMenu />
  </div>
);
