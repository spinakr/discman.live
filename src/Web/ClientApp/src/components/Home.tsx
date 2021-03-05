import * as React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RouteComponentProps } from "react-router";
import { ApplicationState } from "../store";
import * as UserStore from "../store/User";
import Login from "./Login";
import Feed from "./Feed/Feed";
import NewsMessages from "./NewsMessages";
import About from "./About";
import InitSettings from "./InitSettings";

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
  const { user } = props;
  return (
    <div>
      <div className="section pt-0">
        {!user?.loggedIn && (
          <>
            <Login />
            <br />
            <hr />
            <br />
            <About />
          </>
        )}
        {user?.loggedIn && <Feed />}
      </div>
      <NewsMessages />
      <InitSettings />
    </div>
  );
};

export default connector(Home);
