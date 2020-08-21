import * as React from "react";
import { ApplicationState } from "../store";
import { actionCreators } from "../store/User";
import { connect, ConnectedProps } from "react-redux";

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
      {!props.location.pathname.startsWith("/rounds") && (
        <nav className="navbar is-light level is-mobile">
          <div className="level-item has-text-centered">
            <h5 className="title is-5 has-text-weight-semibold	is-family-monospace">
              discman.live
            </h5>
          </div>
        </nav>
      )}
    </>
  );
};

export default connector(Banner);
