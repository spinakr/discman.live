import React from "react";
import { ApplicationState } from "../store";
import { connect, ConnectedProps } from "react-redux";
import { actionCreators as userActionCreator } from "../store/User";
import { Link } from "react-router-dom";
import colors from "../colors";

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
    id: "12",
    body: (setSeen: (id: string) => void) => (
      <div>
        When starting a new round, one player has to create the round, adding
        all players in the "New Round" dialogue.
        <br />
        <br />
        The new round will apear in all users' feeds and as a green "Live"
        button on the home page. Click the live button to start registering
        scores. If you have multiple active rounds, you can find all rounds at
        your&nbsp;
        <Link to="/user" onClick={() => setSeen("12")}>
          profile page.
        </Link>
        <br />
        <br />
        NB: Each player has to register scores before the hole is "completed".
        You can change your score on the active hole or by choosing a previous
        hole by clicking the hole number in the score card.
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
              <header
                className="modal-card-head"
                style={{ backgroundColor: colors.background }}
              >
                <p className="modal-card-title">
                  Info ({i + 1} / {toDisplay.length})
                </p>
              </header>
              <section
                style={{
                  whiteSpace: "pre-wrap",
                  backgroundColor: colors.background,
                }}
                className="modal-card-body"
              >
                {m.body(setSeen)}
              </section>
              <footer
                className="modal-card-foot"
                style={{ backgroundColor: colors.background }}
              >
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
