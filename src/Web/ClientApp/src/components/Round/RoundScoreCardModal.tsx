import React, { useEffect } from "react";
import colors from "../../colors";
import { Round, PlayerCourseStats } from "../../store/Rounds";
import RoundScoreCard from "./RoundScoreCard";

export interface ScoreCardModalProps {
  username: string;
  round: Round;
  activeHole: number;
  setActiveHole: (hole: number) => void;
  playersStats: PlayerCourseStats[];
  closeDialog: () => void;
}

const RoundScoreCardModal = ({
  username,
  round,
  activeHole,
  setActiveHole,
  closeDialog,
  playersStats,
}: ScoreCardModalProps) => {
  const tableRef = React.createRef<HTMLDivElement>();
  useEffect(() => {
    if (tableRef.current) {
      if (activeHole > 4) tableRef.current.scrollLeft = 200;
      if (activeHole > 9) tableRef.current.scrollLeft = 400;
      if (activeHole > 14) tableRef.current.scrollLeft = 600;
    }
  });

  return (
    <div className="modal is-active">
      <div onClick={() => closeDialog()}>
        <div className="modal-background"></div>
      </div>
      <div className="modal-card">
        <div
          className="modal-card-body py-2 px-1"
          style={{ backgroundColor: colors.background }}
        >
          <RoundScoreCard
            username={username || ""}
            round={round}
            activeHole={activeHole}
            setActiveHole={setActiveHole}
            closeDialog={closeDialog}
            playersStats={playersStats}
          />
        </div>
      </div>
    </div>
  );
};

export default RoundScoreCardModal;
