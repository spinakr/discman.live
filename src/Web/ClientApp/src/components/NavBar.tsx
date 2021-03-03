/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { ApplicationState } from "../store";
import * as RoundsStore from "../store/Rounds";
import * as UserStore from "../store/User";
import { Link } from "react-router-dom";
import NewRound from "./Round/NewRound";
import Colors from "../colors";

const mapState = (state: ApplicationState) => {
  return {
    user: state.user,
    round: state.rounds?.round,
    roundInProgress: state.user?.userDetails?.activeRound,
    location: state.router.location,
  };
};

const connector = connect(mapState, {
  ...RoundsStore.actionCreators,
  ...UserStore.actionCreators,
});

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {};

const NavMenu = (props: Props) => {
  return (
    <>
      {(!props.location.pathname.startsWith("/rounds") ||
        props.round?.isCompleted) && (
        <nav
          className="navbar is-flex is-flex-direction-row is-justify-content-space-evenly is-align-items-center is-fixed-bottom py-0 my-0"
          style={{ backgroundColor: Colors.navbar }}
        >
          <div className="is-flex py-0">
            <Link
              to="/"
              className="button pr-1 pl-3"
              style={{ backgroundColor: Colors.navbar }}
            >
              <span className="icon">
                <i className="fas fa-lg fa-clipboard-list"></i>
              </span>
              <span className="is-size-7">Feed</span>
            </Link>
          </div>
          <div className="is-flex py-0">
            {props.roundInProgress ? (
              <Link
                to={`/rounds/${props.roundInProgress}`}
                className="button is-primary waggle pr-1 pl-3"
              >
                <span className="icon">
                  <i className="fas fa-lg fa-spinner" aria-hidden="true"></i>
                </span>
                <span className="is-size-7">Live</span>
              </Link>
            ) : (
              <NewRound />
            )}
          </div>
          <div className="is-flex py-0">
            <Link
              to="/leaders"
              className="button pr-1 pl-3"
              style={{ backgroundColor: Colors.navbar }}
            >
              <span className="icon">
                <i className="fas fa-lg fa-trophy" aria-hidden="true"></i>
              </span>
              <span className="is-size-7">Leaders</span>
            </Link>
          </div>
        </nav>
      )}
    </>
  );
};

export default connector(NavMenu);
