import * as React from "react";
import { ApplicationState } from "../store";
import { actionCreators } from "../store/User";
import { connect, ConnectedProps } from "react-redux";
import { Link } from "react-router-dom";

const mapState = (state: ApplicationState) => {
  return {
    user: state.user,
    round: state.rounds?.round,
    location: state.router.location,
  };
};
const connector = connect(mapState, actionCreators);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux;
const Banner = (props: Props) => {
  return (
    <>
      {!props.location.pathname.startsWith("/rounds") &&
        !(
          props.location.pathname.startsWith("/tournaments") &&
          props.location.pathname.length > 12
        ) && (
          <nav className="navbar is-light level is-mobile">
            <div className="level-item has-text-centered">
              <h5 className="title is-5 has-text-weight-semibold	is-family-monospace">
                discman.live
              </h5>
            </div>
            <div className="navbar-end">
              <div className="navbar-item">
                <Link to="/user" className="button is-light pr-1 pl-3">
                  <span className="icon">
                    <i
                      className="fas fa-lg fa-user-friends"
                      aria-hidden="true"
                    ></i>
                  </span>
                  <span className="is-size-7"></span>
                </Link>
              </div>
            </div>
          </nav>
        )}
    </>
  );
};

export default connector(Banner);
