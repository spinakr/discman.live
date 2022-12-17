import React, { useState } from "react";
import colors from "../colors";

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
          <header
            className="modal-card-head"
            style={{ backgroundColor: colors.background }}
          >
            <p className="modal-card-title">{props.title}</p>
          </header>
          <section
            style={{
              whiteSpace: "pre-wrap",
              backgroundColor: colors.background,
            }}
            className="modal-card-body"
          >
            {props.text}
          </section>
        </div>
      </div>
      <span className="icon is-large has-text-info">
        <i
          onClick={() => setShowDialog(true)}
          className="fas fa-lg fa-info"
        ></i>
      </span>
    </>
  );
};

export default InformationDialogue;
