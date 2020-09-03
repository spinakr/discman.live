import React, { useState, useEffect } from "react";

export interface News {
  id: string;
  body: JSX.Element;
}
const news: News[] = [
  {
    id: "1",
    body: (
      <div>
        You can configure an email address if you lose your password and would
        like to change it. Go to the settings page to change your email.
      </div>
    ),
  },
];

const NewsMessages = () => {
  const [toDisplay, setToDisplay] = useState<News[]>([]);
  useEffect(() => {
    const seenMsgs = localStorage.getItem("newsmsg")?.split(",");
    const tmp = news.filter(
      (n) => !seenMsgs || !seenMsgs?.some((m) => m === n.id)
    );
    setToDisplay(tmp);
  }, []);

  const setSeen = (id: string) => {
    const seenMsgs = localStorage.getItem("newsmsg")?.split(",");
    const updatedSeenMsgs = !seenMsgs ? [id] : [...seenMsgs, id];
    localStorage.setItem("newsmsg", updatedSeenMsgs.join(","));
    setToDisplay(news.filter((n) => !updatedSeenMsgs?.some((m) => m === n.id)));
  };

  return (
    <>
      {toDisplay.map((m, i) => (
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
              {m.body}
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

export default NewsMessages;
