/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RouteComponentProps } from "react-router";
import { ApplicationState } from "../store";
import Login from "./Login";
import UserRounds from "./User/UserRounds";
import { useState } from "react";
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
    <div>
      <div className="section pt-0">
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
                  <a>Tournaments</a>
                </li>
              </ul>
            </div>
            {active === 1 && (
              <>
                <h3 className="title is-3 has-text-centered">Active rounds</h3>
                <UserRounds onlyActive={true} />
              </>
            )}
            {active === 2 && (
              <>
                <Tournaments onlyActive={true} />
                <br />
                <div className="has-text-centered">
                  <NewTournament />
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default connector(Home);
