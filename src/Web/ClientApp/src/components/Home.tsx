/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RouteComponentProps } from "react-router";
import { ApplicationState } from "../store";
import Login from "./Login";
import NewRound from "./Round/NewRound";
import UserRounds from "./User/UserRounds";
import { useState } from "react";
import GlobalLeaderBoard from "./GlobalLeaderBoard";
import HallOfFame from "./HallOfFame";
import AddFriends from "./AddFriends";
import Tournaments from "./Tournaments/Tournaments";
import NewTournament from "./Tournaments/NewTournament";

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
    <div className="section py-0">
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
              <li
                className={active === 3 ? "is-active" : ""}
                onClick={() => setActive(3)}
              >
                <a>Hall of Fame</a>
              </li>
            </ul>
          </div>
          {active === 1 && (
            <>
              <h3 className="title is-3 has-text-centered">Active rounds</h3>
              <UserRounds onlyActive={true} />
              <hr />
              <div className="has-text-centered">
                <NewRound />
                <br />
                <br />
                <AddFriends />
              </div>
              <hr />
              <Tournaments onlyActive={true} />
              <br />
              <div className="has-text-centered">
                <NewTournament />
              </div>
            </>
          )}
          {active === 2 && <GlobalLeaderBoard />}
          {active === 3 && <HallOfFame />}
        </>
      )}
    </div>
  );
};

export default connector(Home);
