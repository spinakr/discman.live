import * as React from "react";
import NavMenu from "./NavMenu";
import Banner from "./Banner";
import Notifications from "./Notifications";

export default (props: { children?: React.ReactNode }) => (
  <React.Fragment>
    <Banner />
    <Notifications />
    <div className="container">{props.children}</div>
    <NavMenu />
  </React.Fragment>
);
