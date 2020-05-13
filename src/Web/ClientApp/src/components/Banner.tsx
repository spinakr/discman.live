import * as React from "react";
import { ApplicationState } from "../store";
import { actionCreators } from "../store/Login";
import { connect, ConnectedProps } from "react-redux";
import { Link } from "react-router-dom";

const mapState = (state: ApplicationState) => state.login;
const connector = connect(mapState, actionCreators);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux;
const Banner = (props: Props) => (
  <nav className="navbar is-light">
    <div className="navbar-brand">
      <div className="navbar-item">
        <Link to="/">discman.live</Link>
      </div>
    </div>
    <div className="navbar-menu is-active">
      <div className="navbar-end">
        <a className="navbar-item" href="/user">
          {props.user ? props.user.username : null}
        </a>
        <div className="navbar-item">
          <a
            className="button is-warning is-light"
            onClick={() => props.logout()}
            href="/"
          >
            Logout
          </a>
        </div>
      </div>
    </div>
  </nav>
);

export default connector(Banner);
