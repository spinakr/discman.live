import * as React from "react";
import NavMenu from "./NavMenu";
import Banner from "./Banner";

export default (props: { children?: React.ReactNode }) => (
  <React.Fragment>
    <Banner />
    <NavMenu />
    <div className="container">{props.children}</div>
  </React.Fragment>
);
