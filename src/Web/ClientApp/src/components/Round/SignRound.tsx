import React, { useRef } from "react";
import colors from "../../colors";
import SignaturePad from "react-signature-canvas";
import { PlayerSignature } from "../../store/Rounds";

export default ({
  completeRound,
  signatures,
  username,
}: {
  completeRound: (base64Signature: string) => void;
  signatures: PlayerSignature[];
  username: string;
}) => {
  const sigPad = useRef<any>({});

  return signatures.some((s) => s.username === username) ? (
    <>
      {signatures.map((s) => {
        return (
          <div key={s.username} className="is-flex is-flex-direction-row">
            <div className="is-flex px-5 mt-2">
              <span className="is-size-5">{s.username}</span>
            </div>
            <div className="is-flex">
              <img
                key={s.username}
                className="signatureImage"
                src={`${s.base64Signature}`}
                alt="Signature"
              />
            </div>
          </div>
        );
      })}
    </>
  ) : (
    <>
      <SignaturePad
        canvasProps={{
          className: "sigCanvas",
        }}
        ref={sigPad}
      />
      <button
        className="button mt-3"
        style={{ backgroundColor: colors.button }}
        onClick={() => {
          completeRound(sigPad.current.toDataURL("image/svg+xml"));
        }}
      >
        {" "}
        Sign Round{" "}
      </button>
    </>
  );
};
