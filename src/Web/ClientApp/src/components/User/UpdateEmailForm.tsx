import React, { useState } from "react";

type Props = {
  currentEmail: string | undefined;
  changeEmail: (email: string) => void;
};

const emailValid = (email: string) => {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,10})+$/.test(email)) return true;
  return false;
};

export default ({ currentEmail, changeEmail }: Props) => {
  const [email, setEmail] = useState<string>("");
  return (
    <>
      <div className="field is-horizontal is-mobile">
        <div className="field-label is-normal">
          <label className="label">Email</label>
          <span className="is-5 is-italic is-light">
            Optional. Used to recover user.
          </span>
        </div>
        <div className="field-body">
          <div className="field">
            <p className="control">
              <input
                className="input is-static"
                type="email"
                onChange={() => {}}
                value={currentEmail || "Email not present"}
              />
            </p>
          </div>
        </div>
      </div>
      <div className="field is-grouped">
        <div className="control is-expanded">
          <input
            className={`input ${!emailValid(email) && "is-danger"}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="New email"
          />
        </div>
        <div className="control">
          <button
            disabled={email === "" || !email || !emailValid(email)}
            className="button is-success is-light is-outlined"
            onClick={() => {
              changeEmail(email);
              setEmail("");
            }}
          >
            Save
          </button>
        </div>
      </div>
    </>
  );
};
