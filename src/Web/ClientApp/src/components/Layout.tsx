import * as React from "react";
import NavMenu from "./NavMenu";
import Banner from "./Banner";

export default (props: { children?: React.ReactNode }) => (
  <React.Fragment>
    <Banner />
    <NavMenu />
    <section className="section">
      <div className="container">{props.children}</div>
    </section>
  </React.Fragment>
);
