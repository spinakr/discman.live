/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RouteComponentProps } from "react-router";
import { ApplicationState } from "../store";
import * as UserStore from "../store/User";
import Feed from "./Feed/Feed";
import NewsMessages from "./NewsMessages";
import About from "./About";
import InitSettings from "./InitSettings";
import Signup from "./Signup";
import colors from "../colors";
import { Link } from "react-router-dom";
import AddFriends from "./AddFriends";

const mapState = (state: ApplicationState) => {
  return {
    user: state.user,
    tournaments: state.tournaments?.tournaments,
  };
};

const connector = connect(mapState, UserStore.actionCreators);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & RouteComponentProps & {};

const Home = (props: Props) => {
  React.useEffect(() => {});
  const { user } = props;
  return (
    <div>
      <div className="section pt-0">
        {!user?.loggedIn && (
          <>
            <nav className="navbar is-mobile is-fixed-bottom is-transparent">
              <div className="navbar-item is-expanded is-flex is-flex-direction-row is-justify-content-space-evenly py-4">
                <div className="is-flex">
                  <Link to="/signup" className="button is-medium is-warning">
                    <strong>Sign up</strong>
                  </Link>
                </div>
                <div className="is-flex">
                  <Link to="/login" className="button is-medium is-light">
                    Log in
                  </Link>
                </div>
              </div>
            </nav>

            <About />
          </>
        )}
        {user?.loggedIn && <Feed />}

        {user?.userDetails?.friends && user?.userDetails?.friends.length < 2 && (
          <div className="is-flex is-flex-direction-row is-justify-content-space-evenly">
            <div className="is-flex">
              <AddFriends />
            </div>
          </div>
        )}
      </div>
      <NewsMessages />
      <InitSettings />
    </div>
  );
};

export default connector(Home);
