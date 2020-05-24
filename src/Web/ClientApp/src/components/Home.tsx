import * as React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RouteComponentProps } from "react-router";
import { ApplicationState } from "../store";
import Login from "./Login";
import NewRound from "./Round/NewRound";
import UserRounds from "./User/UserRounds";
import { useState } from "react";
import GlobalLeaderBoard from "./GlobalLeaderBoard";

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
  const [active, setActive] = useState(1);

  return (
    <div className="section">
      {!user?.loggedIn && <Login />}
      {user?.loggedIn && (
        <>
          <div className="tabs is-centered">
            <ul>
              <li
                className={active === 1 ? "is-active" : ""}
                onClick={() => setActive(1)}
              >
                <a>Rounds</a>
              </li>
              <li
                className={active === 2 ? "is-active" : ""}
                onClick={() => setActive(2)}
              >
                <a>Leaderboard</a>
              </li>
            </ul>
          </div>
          {active === 1 && (
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
          {active === 2 && <GlobalLeaderBoard />}
        </>
      )}
    </div>
  );
};

export default connector(Home);
