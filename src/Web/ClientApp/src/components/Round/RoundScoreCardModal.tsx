import React, { useEffect } from "react";
import { Round } from "../../store/Rounds";
import RoundScoreCard from "./RoundScoreCard";

export interface ScoreCardModalProps {
  username: string;
  round: Round;
  activeHole: number;
  setActiveHole: (hole: number) => void;
  closeDialog: () => void;
}

const RoundScoreCardModal = ({
  username,
  round,
  activeHole,
  setActiveHole,
  closeDialog,
}: ScoreCardModalProps) => {
  const tableRef = React.createRef<HTMLDivElement>();
  useEffect(() => {
    if (tableRef.current) {
      if (activeHole > 5) tableRef.current.scrollLeft = 200;
      if (activeHole > 10) tableRef.current.scrollLeft = 400;
      if (activeHole > 15) tableRef.current.scrollLeft = 600;
    }
  });

  return (
    <div className="modal is-active">
      <div onClick={() => closeDialog()}>
        <div className="modal-background"></div>
      </div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title"></p>
        </header>
        <div className="modal-card-body is-marginless is-paddingless">
          <RoundScoreCard
            username={username || ""}
            round={round}
            activeHole={activeHole}
            setActiveHole={setActiveHole}
            closeDialog={closeDialog}
          />
        </div>
        <footer className="modal-card-foot"></footer>
      </div>
    </div>
  );
};

export default RoundScoreCardModal;
