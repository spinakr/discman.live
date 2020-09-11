import React, { useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { ApplicationState } from "../../store";
import * as UserStore from "../../store/User";

const mapState = (state: ApplicationState) => {
  return {
    user: state.user,
  };
};

const connector = connect(mapState, UserStore.actionCreators);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {};

const emailValid = (email: string) => {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,10})+$/.test(email)) return true;
  return false;
};

const UserSettings = (props: Props) => {
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [email, setEmail] = useState<string>("");

  return (
    <div>
      <h2 className="title is-2 has-text-centered">
        {props.user?.user?.username}
      </h2>

      <div className="section pt-1">
        <h4 className="subtitle is-4 has-text-centered">Change password</h4>
        <div className="field">
          <p className="control has-icons-left">
            <input
              className="input"
              type="password"
              placeholder="Password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
            />
            <span className="icon is-small is-left">
              <i className="fas fa-lock"></i>
            </span>
          </p>
        </div>
        <div className="field">
          <p className="control has-icons-left">
            <input
              className="input"
              type="password"
              placeholder="Repeat password"
              value={pw2}
              onChange={(e) => setPw2(e.target.value)}
            />
            <span className="icon is-small is-left">
              <i className="fas fa-lock"></i>
            </span>
          </p>
        </div>
        <div className="field ">
          <div className="control">
            <button
              disabled={pw === "" || !pw || !pw2 || pw !== pw2}
              className="button is-success is-light is-outlined"
              onClick={() => {
                props.changePassword(pw);
                setPw("");
                setPw2("");
              }}
            >
              Change password
            </button>
          </div>
        </div>
        <hr />

        <div className="field is-horizontal">
          <div className="field-label is-normal">
            <label className="label">Email</label>
          </div>
          <div className="field-body">
            <div className="field">
              <p className="control">
                <input
                  className="input is-static"
                  type="email"
                  onChange={() => {}}
                  value={props.user?.userDetails?.email || "Email not present"}
                />
              </p>
            </div>
          </div>
        </div>

        <div className="field is-horizontal">
          <div className="field-body">
            <div className="field">
              <p className="control">
                <input
                  className={`input ${!emailValid(email) && "is-danger"}`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="New email"
                />
              </p>
            </div>
          </div>
        </div>
        <div className="field ">
          <div className="control">
            <button
              disabled={email === "" || !email || !emailValid(email)}
              className="button is-success is-light is-outlined"
              onClick={() => {
                props.changeEmail(email);
                setEmail("");
              }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default connector(UserSettings);
