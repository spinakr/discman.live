/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { ApplicationState } from "../../store";
import * as UserStore from "../../store/User";
import { Link } from "react-router-dom";
import AddFriends from "../AddFriends";

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
  return (
    <div>
      <h2 className="title is-2 has-text-centered">Friends</h2>

      <div className="section pt-0">
        <div className="has-text-centered">
          <AddFriends />
          <hr />
        </div>
        <div className="panel has-text-centered">
          {props.user?.friendUsers.map((f) => {
            return (
              <Link to={`users/${f}`} key={f} className="panel-block">
                {f}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default connector(UserComponent);
