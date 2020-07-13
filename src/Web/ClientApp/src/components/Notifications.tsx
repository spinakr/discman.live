/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { ApplicationState } from "../store";
import * as NotificationsStore from "../store/Notifications";
import "./Notifications.css";

const mapState = (state: ApplicationState) => {
  return {
    notifications: state.notifications?.notifications,
  };
};

const connector = connect(mapState, NotificationsStore.actionCreators);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {};

const NotificationsComponent = (props: Props) => {
  return (
    <>
      {props.notifications &&
        props.notifications.map((n) => {
          return (
            <div key={n.id} className="notification is-primary is-light toast">
              <button
                className="delete"
                onClick={() => props.hideNotification(n.id)}
              ></button>
              {n.message}
            </div>
          );
        })}
    </>
  );
};

export default connector(NotificationsComponent);
