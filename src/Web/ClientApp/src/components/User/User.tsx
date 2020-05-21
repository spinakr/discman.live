import React, { useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { ApplicationState } from "../../store";
import * as UserStore from "../../store/User";
import UserStats from "./UserStats";
import UserRounds from "./UserRounds";

const mapState = (state: ApplicationState) => {
  return {
    user: state.user,
  };
};

const connector = connect(mapState, UserStore.actionCreators);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {};

const UserComponent = (props: Props) => {
  const [active, setActive] = useState(1);
  return (
    <div>
      <h2 className="title is-2 has-text-centered">
        {props.user?.user?.username}
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
            className={active === 2 ? "is-active" : ""}
            onClick={() => setActive(2)}
          >
            <a>Stats</a>
          </li>
        </ul>
      </div>
      {active === 1 && (
        <div className="section">
          <UserRounds />
        </div>
      )}
      {active === 2 && <UserStats />}
    </div>
  );
};

export default connector(UserComponent);
