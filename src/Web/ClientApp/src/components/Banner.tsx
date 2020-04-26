import * as React from "react";
import { ApplicationState } from "../store";
import { connect, ConnectedProps } from "react-redux";

const mapState = (state: ApplicationState) => state.login;
const connector = connect(mapState);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux;
const Banner = (props: Props) => (
  <nav className="navbar is-light">
    <div className="navbar-brand">
      <a className="navbar-item" href="/">
        Disclive
      </a>
    </div>
    <div className="navbar-menu">
      <div className="navbar-end">
        <a className="navbar-item" href="/user">
          {props.user ? props.user.username : null}
        </a>
      </div>
    </div>
  </nav>
);

export default connector(Banner);