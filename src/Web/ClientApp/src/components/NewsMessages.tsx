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
    newsSeen: state.user?.userDetails?.newsIdsSeen,
  };
};

const connector = connect(mapState, userActionCreator);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {};

const news: News[] = [
  {
    id: "5",
    body: (setSeen: (id: string) => void) => (
      <div>
        You can configure an email address if you lose your password and would
        like to change it. Go to the settings page to change your email.
        <br />
        <Link to="/settings" onClick={() => setSeen("5")}>
          {" "}
          Close and go to settings page
        </Link>
      </div>
    ),
  },
];

const NewsMessages = (props: Props) => {
  const [toDisplay, setToDisplay] = useState<News[] | null>(null);
  useEffect(() => {
    const seenMsgs = props.newsSeen;
    const tmp = news.filter(
      (n) => !seenMsgs || !seenMsgs?.some((m) => m === n.id)
    );
    setToDisplay(tmp);
  }, [props.newsSeen]);

  const setSeen = (id: string) => {
    props.setNewsSeen(id);
  };

  return (
    <>
      {toDisplay &&
        props.newsSeen &&
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
