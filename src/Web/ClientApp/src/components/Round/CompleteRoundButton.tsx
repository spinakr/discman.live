import React, { useState } from "react";
import colors from "../../colors";

export default ({ completeRound }: { completeRound: () => void }) => {
  const [completeActive, setCompleteActive] = useState(true);
  return (
    <button
      className="button mt-3"
      style={{ backgroundColor: colors.button }}
      onClick={() => {
        if (window.confirm("Do you want to complete the round?")) {
          completeRound();
          setCompleteActive(false);
        }
      }}
      disabled={!completeActive}
    >
      {" "}
      Complete Round{" "}
    </button>
  );
};
