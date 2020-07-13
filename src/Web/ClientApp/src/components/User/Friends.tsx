/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { ApplicationState } from "../../store";
import * as UserStore from "../../store/User";
import { Link } from "react-router-dom";

const mapState = (state: ApplicationState) => {
  return {
    user: state.user,
  };
};

const connector = connect(mapState, UserStore.actionCreators);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {};

const UserComponent = (props: Props) => {
  const { fetchUsers } = props;
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);
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
            <a>Friends</a>
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
        <div className="section">
          <div className="list has-text-centered">
            {props.user?.friendUsers.map((f) => {
              return (
                <Link to={`users/${f}`} key={f} className="list-item">
                  {f}
                </Link>
              );
            })}
          </div>
        </div>
      )}
      {active === 2 && <div></div>}
    </div>
  );
};

export default connector(UserComponent);
