import * as React from "react";
import NavMenu from "./NavMenu";
import Notifications from "./Notifications";
import Banner from "./Banner";

export default (props: { children?: React.ReactNode }) => (
  <React.Fragment>
    <Banner />
    <Notifications />
    <div className="container pb-2" style={{ height: "100%" }}>
      {props.children}
    </div>
    <NavMenu />
  </React.Fragment>
);
