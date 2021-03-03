/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RouteComponentProps } from "react-router";
import { ApplicationState } from "../store";
import Login from "./Login";
import { useState } from "react";
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
  const [active, setActive] = useState(2);

  return (
    <div className="section pt-0">
      {!user?.loggedIn && <Login />}
      {user?.loggedIn && (
        // <>
        //   <div className="tabs is-fullwidth is-centered">
        //     <ul>
        //       <li
        //         className={active === 2 ? "is-active" : ""}
        //         onClick={() => setActive(2)}
        //       >
        //         <a>Leaderboard</a>
        //       </li>
        //       <li
        //         className={active === 3 ? "is-active" : ""}
        //         onClick={() => setActive(3)}
        //       >
        //         <a>Hall of Fame</a>
        //       </li>
        //     </ul>
        //   </div>
        //   {active === 2 && <GlobalLeaderBoard />}
        //   {active === 3 && <HallOfFame />}
        // </>
        <LeaderBoard />
      )}
    </div>
  );
};

export default connector(Leaders);
