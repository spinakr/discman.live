import * as React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RouteComponentProps } from "react-router";
import { ApplicationState } from "../store";
import Login from "./Login";
import NewRound from "./Round/NewRound";
import UserRounds from "./User/UserRounds";

const mapState = (state: ApplicationState) => {
  return {
    user: state.user,
  };
};

const connector = connect(mapState);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & RouteComponentProps & {};

const Home = (props: Props) => {
  const { user } = props;

  return (
    <div className="section">
      {!user?.loggedIn && <Login />}
      {user?.loggedIn && (
        <>
          <h3 className="title is-3 has-text-centered">Active rounds</h3>
          <UserRounds onlyActive={true} />
          <hr />
          <div className="columns is-centered is-mobile">
            <div className="column is-one-third">
              <NewRound />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default connector(Home);
