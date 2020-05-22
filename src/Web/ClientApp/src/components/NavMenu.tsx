/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { ApplicationState } from "../store";
import * as RoundsStore from "../store/Rounds";
import { ScoreMode } from "../store/Rounds";
import { Link } from "react-router-dom";

const mapState = (state: ApplicationState) => {
  return {
    user: state.user,
    round: state.rounds?.round,
    location: state.router.location,
  };
};

const connector = connect(mapState, RoundsStore.actionCreators);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {};

const NavMenu = (props: Props) => {
  const [open, setOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  return (
    <>
      <nav className="navbar is-fixed-bottom is-light">
        <div className="navbar-brand">
          {!props.location.pathname.startsWith("/rounds") &&
            !props.location.pathname.startsWith("/courses") && (
              <>
                <div className="navbar-item"></div>
              </>
            )}
          {props.round && props.location.pathname.startsWith("/rounds") && (
            <div className="navbar-item">
              <button
                className="button is-warning tour-scorecard"
                onClick={() => props.setScorecardOpen(true)}
              >
                <strong>Scorecard</strong>
              </button>
            </div>
          )}
        </div>

        <div className="navbar-menu tour-score-mode" id="navbarBasicExample">
          <div className="navbar-end">
            {
              <div
                className={`navbar-item has-dropdown has-dropdown-up ${
                  open ? "is-active" : ""
                }`}
              >
                <a
                  className="navbar-link tour-change-mode"
                  onClick={() => setOpen(!open)}
                >
                  Menu
                </a>

                <div className="navbar-dropdown is-right">
                  {props.round &&
                    props.location.pathname.startsWith("/rounds") &&
                    props.user?.user?.username === props.round?.createdBy && (
                      <>
                        {props.round.scoreMode === ScoreMode.DetailedLive && (
                          <a
                            className="navbar-item"
                            onClick={() => {
                              setOpen(false);
                              props.setScoringMode(ScoreMode.StrokesLive);
                            }}
                          >
                            Simple scoring
                          </a>
                        )}
                        {props.round.scoreMode === ScoreMode.StrokesLive && (
                          <a
                            className="navbar-item"
                            onClick={() => {
                              setOpen(false);
                              props.setScoringMode(ScoreMode.DetailedLive);
                            }}
                          >
                            Detailed scoring
                          </a>
                        )}

                        <a
                          className="navbar-item has-text-danger"
                          onClick={() => setConfirmDelete(true)}
                        >
                          <strong>Delete round</strong>
                        </a>
                      </>
                    )}
                  <hr className="navbar-divider" />
                  <Link
                    to="/courses"
                    className="navbar-item"
                    onClick={() => setOpen(false)}
                  >
                    Courses
                  </Link>
                  <Link
                    to="/user"
                    className="navbar-item"
                    onClick={() => setOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/friends"
                    className="navbar-item"
                    onClick={() => setOpen(false)}
                  >
                    Friends
                  </Link>
                </div>
              </div>
            }
          </div>
        </div>
      </nav>

      <div className={`modal ${confirmDelete ? "is-active" : ""}`}>
        <a href="" onClick={() => setConfirmDelete(false)}>
          {" "}
          <div className="modal-background"></div>{" "}
        </a>
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
