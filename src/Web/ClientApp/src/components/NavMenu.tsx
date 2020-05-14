/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { ApplicationState } from "../store";
import * as RoundsStore from "../store/Rounds";
import NewRound from "./NewRound";
import { ScoreMode } from "../store/Rounds";
import { Link } from "react-router-dom";
import NewCourse from "./Courses/NewCourse";

const mapState = (state: ApplicationState) => {
  return {
    login: state.login,
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
                <div className="navbar-item">
                  <NewRound />
                </div>
                <div className="navbar-item">
                  <Link
                    to="/courses"
                    className="button is-primary is-light is-link is-outlined"
                  >
                    Courses
                  </Link>
                </div>
              </>
            )}
          {props.location.pathname.startsWith("/courses") && (
            <div className="navbar-item">
              <NewCourse />
            </div>
          )}
          {props.round && props.location.pathname.startsWith("/rounds") && (
            <div className="navbar-item">
              <button
                className="button is-warning"
                onClick={() => props.setScorecardOpen(true)}
              >
                <strong>Scorecard</strong>
              </button>
            </div>
          )}
        </div>

        <div className="navbar-menu tour-score-mode">
          <div className="navbar-end">
            {props.round &&
              props.location.pathname.startsWith("/rounds") &&
              props.login?.user?.username === props.round?.createdBy && (
                <div
                  className={`navbar-item has-dropdown has-dropdown-up ${
                    open ? "is-active" : ""
                  }`}
                >
                  <a className="navbar-link" onClick={() => setOpen(!open)}>
                    Options
                  </a>

                  <div className="navbar-dropdown is-right">
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
                    <hr className="navbar-divider" />

                    <a
                      className="navbar-item has-text-danger"
                      onClick={() => setConfirmDelete(true)}
                    >
                      <strong>Delete round</strong>
                    </a>
                  </div>
                </div>
              )}
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
