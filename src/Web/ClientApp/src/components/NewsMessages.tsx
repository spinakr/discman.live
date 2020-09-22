import React, { useState, useEffect } from "react";
import { ApplicationState } from "../store";
import { connect, ConnectedProps } from "react-redux";
import { actionCreators as userActionCreator } from "../store/User";
import { Link } from "react-router-dom";

export interface News {
  id: string;
  body: (setSeen: (id: string) => void) => JSX.Element;
}

const mapState = (state: ApplicationState) => {
  return {
    user: state.user,
  };
};

const connector = connect(mapState, userActionCreator);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {};

const news: News[] = [
  {
    id: "10",
    body: (setSeen: (id: string) => void) => (
      <div>
        In the settings page you can configure your email address to be used if
        you loose your password.
        <br />
        <br />
        You also have the choice between two scoring modes, detailed and simple.
        It is recomended to turn on detailed scoring to get the most out of
        discman.live
        <br />
        <br />
        <Link to="/settings" onClick={() => setSeen("10")}>
          Close and go to settings page
        </Link>
      </div>
    ),
  },
];

const NewsMessages = (props: Props) => {
  const seenMsgs = props.user?.userDetails?.newsIdsSeen;
  const toDisplay = seenMsgs
    ? news.filter((n) => !seenMsgs?.some((m) => m === n.id))
    : news;

  const setSeen = (id: string) => {
    props.setNewsSeen(id);
  };

  return (
    <>
      {toDisplay &&
        seenMsgs &&
        toDisplay.map((m, i) => (
          <div className="modal is-active" key={m.id}>
            <div className="modal-background  "></div>
            <div className="modal-card">
              <header className="modal-card-head">
                <p className="modal-card-title">
                  News ({i + 1} / {toDisplay.length})
                </p>
              </header>
              <section
                style={{ whiteSpace: "pre-wrap" }}
                className="modal-card-body"
              >
                {m.body(setSeen)}
              </section>
              <footer className="modal-card-foot">
                <button className="button" onClick={() => setSeen(m.id)}>
                  Close
                </button>
              </footer>
            </div>
          </div>
        ))}
    </>
  );
};

export default connector(NewsMessages);