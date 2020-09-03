/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { ApplicationState } from "../store";
import * as RoundsStore from "../store/Rounds";
import * as UserStore from "../store/User";
import { ScoreMode } from "../store/Rounds";
import { Link } from "react-router-dom";
import SaveCourseFromRound from "./Round/SaveCourseFromRound";
import RoundStatus from "./Round/RoundStatus";
import NewRound from "./Round/NewRound";

const mapState = (state: ApplicationState) => {
  return {
    user: state.user,
    round: state.rounds?.round,
    roundInProgress: state.user?.roundInProgress,
    location: state.router.location,
  };
};

const connector = connect(mapState, {
  ...RoundsStore.actionCreators,
  ...UserStore.actionCreators,
});

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {};

const NavMenu = (props: Props) => {
  const [open, setOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmSkipHole, setConfirmSkipHole] = useState(false);
  const [confirmLeaveRound, setConfirmLeaveRound] = useState(false);
  return (
    <>
      <nav className="navbar is-fixed-bottom is-light py-0 my-0">
        <div className="navbar-item columns py-0 my-0">
          {(!props.location.pathname.startsWith("/rounds") ||
            props.round?.isCompleted) && (
            <>
              <div className="column py-0">
                <Link to="/" className="button is-light pr-1 pl-3">
                  <span className="icon">
                    <i className="fas fa-lg fa-clipboard-list"></i>
                  </span>
                  <span className="is-size-7">Feed</span>
                </Link>
              </div>
              <div className="column py-0">
                {props.roundInProgress ? (
                  <Link
                    to={`/rounds/${props.roundInProgress.id}`}
                    className="button is-primary waggle pr-1 pl-3"
                  >
                    <span className="icon">
                      <i
                        className="fas fa-lg fa-spinner"
                        aria-hidden="true"
                      ></i>
                    </span>
                    <span className="is-size-7">Live</span>
                  </Link>
                ) : (
                  <NewRound />
                )}
              </div>
              <div className="column py-0">
                <Link to="/leaders" className="button is-light pr-1 pl-3">
                  <span className="icon">
                    <i className="fas fa-lg fa-trophy" aria-hidden="true"></i>
                  </span>
                  <span className="is-size-7">Leaders</span>
                </Link>
              </div>
            </>
          )}

          {props.round &&
            props.location.pathname.startsWith("/rounds") &&
            !props.round.isCompleted && (
              <>
                <div className="column">
                  <a
                    className="button is-light pr-1 pl-3"
                    onClick={() => props.setScorecardOpen(true)}
                  >
                    <span className="icon">
                      <i
                        className="fas fa-lg fa-list-ol"
                        aria-hidden="true"
                      ></i>
                    </span>
                    <span className="is-size-7">Scores</span>
                  </a>
                </div>
                <div className="column">
                  <RoundStatus />
                </div>
              </>
            )}
        </div>

        <div className="navbar-menu tour-score-mode">
          <div className="navbar-end">
            <div className="navbar-item py-0">
              <div className={`dropdown is-up is-right ${open && "is-active"}`}>
                <div className="dropdown-trigger">
                  <button
                    className="button is-light "
                    aria-haspopup="true"
                    aria-controls="dropdown-menu7"
                    onClick={() => setOpen(!open)}
                  >
                    <span className="icon">
                      <i className="fas fa-lg fa-bars" aria-hidden="true"></i>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={open ? "modal is-active" : "modal"}>
          <div
            onClick={() => {
              setOpen(false);
            }}
          >
            <div className="modal-background"></div>
          </div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">Menu</p>
            </header>
            <section className="modal-card-body">
              {props.round && props.location.pathname.startsWith("/rounds") && (
                <>
                  <article className="panel">
                    {props.round.isCompleted && !props.round.courseName && (
                      <SaveCourseFromRound setOpen={setOpen} />
                    )}

                    <span
                      className="panel-block has-text-danger"
                      onClick={() => {
                        setConfirmLeaveRound(true);
                      }}
                    >
                      <span className="panel-icon">
                        <i className="fas fa-lg fa-door-open"></i>
                      </span>
                      &nbsp; Leave round
                    </span>

                    {props.user?.user?.username === props.round?.createdBy && (
                      <>
                        {props.round.scoreMode === ScoreMode.DetailedLive && (
                          <span
                            className="panel-block"
                            onClick={() => {
                              setOpen(false);
                              props.setScoringMode(ScoreMode.StrokesLive);
                            }}
                          >
                            <span className="panel-icon">
                              <i className="fas fa-lg fa-toggle-off"></i>
                            </span>
                            &nbsp; Simple scoring
                          </span>
                        )}
                        {props.round.scoreMode === ScoreMode.StrokesLive && (
                          <span
                            className="panel-block"
                            onClick={() => {
                              setOpen(false);
                              props.setScoringMode(ScoreMode.DetailedLive);
                            }}
                          >
                            <span className="panel-icon">
                              <i className="fas fa-lg fa-toggle-off"></i>
                            </span>
                            &nbsp; Detailed scoring
                          </span>
                        )}
                        <span
                          className="panel-block has-text-danger"
                          onClick={() => setConfirmSkipHole(true)}
                        >
                          <span className="panel-icon">
                            <i className="fas fa-lg fa-forward"></i>
                          </span>
                          &nbsp; Skip hole
                        </span>
                        <span
                          className="panel-block has-text-danger"
                          onClick={() => setConfirmDelete(true)}
                        >
                          <span className="panel-icon">
                            <i className="fas fa-lg fa-backspace"></i>
                          </span>
                          &nbsp; Delete round
                        </span>
                      </>
                    )}
                  </article>
                </>
              )}
              <article className="panel">
                <Link
                  to="/"
                  className="panel-block"
                  onClick={() => setOpen(false)}
                >
                  <span className="panel-icon">
                    <i className="fas fa-lg fa-home"></i>
                  </span>
                  &nbsp; Home
                </Link>
                <Link
                  to="/courses"
                  className="panel-block"
                  onClick={() => setOpen(false)}
                >
                  <span className="panel-icon">
                    <i className="fas fa-lg fa-cloud-sun"></i>
                  </span>
                  &nbsp; Courses
                </Link>
                <Link
                  to="/tournaments"
                  className="panel-block"
                  onClick={() => setOpen(false)}
                >
                  <span className="panel-icon">
                    <i className="fas fa-lg fa-trophy"></i>
                  </span>
                  &nbsp; Tournaments
                </Link>
                <Link
                  to="/friends"
                  className="panel-block"
                  onClick={() => setOpen(false)}
                >
                  <span className="panel-icon">
                    <i className="fas fa-lg fa-user-friends"></i>
                  </span>
                  &nbsp; Friends
                </Link>
                <Link
                  to="/user"
                  className="panel-block"
                  onClick={() => setOpen(false)}
                >
                  <span className="panel-icon">
                    <i className="fas fa-lg fa-user"></i>
                  </span>
                  &nbsp; Profile
                </Link>
                <Link
                  to="/settings"
                  className="panel-block"
                  onClick={() => setOpen(false)}
                >
                  <span className="panel-icon">
                    <i className="fas fa-lg fa-cogs"></i>
                  </span>
                  &nbsp; Settings
                </Link>
              </article>
              <article className="panel">
                <span
                  className="panel-block"
                  onClick={() => {
                    props.logout();
                    setOpen(false);
                  }}
                >
                  <span className="panel-icon">
                    <i className="fas fa-lg fa-sign-out-alt"></i>
                  </span>
                  &nbsp; Logout
                </span>
              </article>
            </section>
            <footer className="modal-card-foot">
              <button className="button" onClick={() => setOpen(false)}>
                Close
              </button>
            </footer>
          </div>
        </div>
      </nav>

      <div className={`modal ${confirmLeaveRound ? "is-active" : ""}`}>
        <div onClick={() => setConfirmLeaveRound(false)}>
          <div className="modal-background"></div>{" "}
        </div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Leave round?</p>
          </header>
          <section className="modal-card-body">
            <p>
              You will be removed from the round and all your scores deleted,
              are you sure?
            </p>
            <hr />
            <div className="field">
              <div className="control">
                <button
                  className="button is-danger"
                  onClick={() => {
                    setOpen(false);
                    setConfirmLeaveRound(false);
                    props.leaveRound(props.round?.id || "");
                  }}
                >
                  Confirm
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>

      <div className={`modal ${confirmSkipHole ? "is-active" : ""}`}>
        <div onClick={() => setConfirmSkipHole(false)}>
          {" "}
          <div className="modal-background"></div>{" "}
        </div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Skip hole?</p>
          </header>
          <section className="modal-card-body">
            <p>Hole will be removed from the current round, are you sure?</p>
            <hr />
            <div className="field">
              <div className="control">
                <button
                  className="button is-danger"
                  onClick={() => {
                    setOpen(false);
                    setConfirmSkipHole(false);
                    props.skipHole(props.round?.id || "");
                  }}
                >
                  Confirm
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>

      <div className={`modal ${confirmDelete ? "is-active" : ""}`}>
        <div onClick={() => setConfirmDelete(false)}>
          {" "}
          <div className="modal-background"></div>{" "}
        </div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Delete round?</p>
          </header>
          <section className="modal-card-body">
            <p>
              Round will be permanently deleted for all players, are you sure?
            </p>
            <hr />
            <div className="field">
              <div className="control">
                <button
                  className="button is-danger"
                  onClick={() => {
                    setOpen(false);
                    setConfirmDelete(false);
                    props.deleteRound(props.round?.id || "");
                  }}
                >
                  Confirm
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default connector(NavMenu);
