/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { ApplicationState } from "../../store";
import * as UserStore from "../../store/User";
import UserStats from "./UserStats";
import UserRounds from "./UserRounds";
import { useParams } from "react-router";
import UserAchievements from "./UserAchievements";
import Tournaments from "../Tournaments/Tournaments";

const mapState = (state: ApplicationState) => {
  return {
    user: state.user,
  };
};

const connector = connect(mapState, UserStore.actionCreators);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {};

const UserComponent = (props: Props) => {
  const { username } = useParams();
  const [active, setActive] = useState(1);
  return (
    <div>
      <h2 className="title is-2 has-text-centered">
        {username || props.user?.user?.username}
      </h2>

      <div className="tabs is-centered">
        <ul>
          <li
            className={active === 1 ? "is-active" : ""}
            onClick={() => setActive(1)}
          >
            <a>Rounds</a>
          </li>
          <li
            className={active === 4 ? "is-active" : ""}
            onClick={() => setActive(4)}
          >
            <a>Tourneys</a>
          </li>
          <li
            className={active === 2 ? "is-active" : ""}
            onClick={() => setActive(2)}
          >
            <a>Stats</a>
          </li>
          <li
            className={active === 3 ? "is-active" : ""}
            onClick={() => setActive(3)}
          >
            <a>Achievements</a>
          </li>
        </ul>
      </div>
      {active === 1 && (
        <div className="section pt-0">
          <UserRounds />
        </div>
      )}
      {active === 2 && <UserStats />}
      {active === 3 && <UserAchievements />}
      {active === 4 && <Tournaments />}
    </div>
  );
};

export default connector(UserComponent);
