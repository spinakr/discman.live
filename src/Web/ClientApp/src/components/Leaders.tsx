import * as React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RouteComponentProps } from "react-router";
import { ApplicationState } from "../store";
import Login from "./Login";
import LeaderBoard from "./LeaderBoard";

const mapState = (state: ApplicationState) => {
  return {
    user: state.user,
  };
};

const connector = connect(mapState);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & RouteComponentProps & {};

const Leaders = (props: Props) => {
  const { user } = props;

  return (
    <div className="section pt-0">
      {!user?.loggedIn && <Login />}
      {user?.loggedIn && <LeaderBoard />}
    </div>
  );
};

export default connector(Leaders);
