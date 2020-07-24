/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";

type InformationDialogueProps = {
  text: string;
  title: string;
};

const InformationDialogue = (props: InformationDialogueProps) => {
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
            <p className="modal-card-title">{props.title}</p>
          </header>
          <section
            style={{ whiteSpace: "pre-wrap" }}
            className="modal-card-body"
          >
            {props.text}
          </section>
          <footer className="modal-card-foot">
            <button className="button" onClick={() => setShowDialog(false)}>
              Close
            </button>
          </footer>
        </div>
      </div>
      <span className="icon is-large has-text-info">
        <i
          onClick={() => setShowDialog(true)}
          className="fas fa-2x fa-info"
        ></i>
      </span>
    </>
  );
};

export default InformationDialogue;
