import React, { useState, useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { ApplicationState } from "../../store";
import { actionCreators as userActions } from "../../store/User";
import { Link } from "react-router-dom";

export interface SpectatorsProps {
  spectators: string[];
}

const mapState = (state: ApplicationState) => {
  return {
    round: state.rounds?.round,
    username: state.user?.user?.username,
  };
};

const connector = connect(mapState, {
  ...userActions,
});

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  spectators: string[];
};

const Spectators = (props: Props) => {
  const { spectatorJoined, spectatorLeft, round, username } = props;
  const roundId = round?.id;
  const partOfRound = round?.playerScores.some(
    (s) => s.playerName === username
  );
  useEffect(() => {
    if (roundId && !partOfRound) {
      spectatorJoined(roundId);
    }
    return () => {
      if (roundId && !partOfRound) {
        spectatorLeft(roundId);
      }
    };
  }, [partOfRound, roundId, spectatorJoined, spectatorLeft, username]);
  const [showDialog, setShowDialog] = useState(false);
  return (
    <>
      <div className={showDialog ? "modal is-active" : "modal"}>
        <div
          onClick={() => {
            setShowDialog(false);
          }}
        >
          <div className="modal-background"></div>
        </div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Spectators</p>
          </header>
          <section className="modal-card-body ">
            <div className="panel">
              {props.spectators.map((s) => (
                <Link
                  to={`/users/${s}`}
                  key={s}
                  className="panel-block is-size-5 is-family-monospace"
                >
                  <span className="panel-icon">
                    <i className="fas fa-glasses" aria-hidden="true"></i>
                  </span>
                  {s}
                </Link>
              ))}
            </div>
          </section>
          <footer className="modal-card-foot">
            <button className="button" onClick={() => setShowDialog(false)}>
              Close
            </button>
          </footer>
        </div>
      </div>
      {props.spectators.length > 0 && (
        <span
          style={{
            position: "absolute",
            top: 5,
            left: 5,
          }}
          className="icon is-large waggle"
          onClick={() => setShowDialog(true)}
        >
          <i className="fas fa-2x fa-glasses"></i>
        </span>
      )}
    </>
  );

  //   return (
  //     <div
  //       style={{
  //         position: "absolute",
  //         top: 0,
  //         left: 0,
  //         maxWidth: "80px",
  //         whiteSpace: "nowrap",
  //         overflow: "hidden",
  //         textOverflow: "ellipsis",
  //       }}
  //     >
  //       {props.spectators.map((s) => (
  //         <div key={s} className="is-size-7 is-family-monospace">
  //           <span className="icon is-small">
  //             <i className="fas fa-glasses"></i>
  //           </span>
  //           {s}
  //         </div>
  //       ))}
  //     </div>
  //   );
};

export default connector(Spectators);
