import React, { useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { ApplicationState } from "../../store";
import * as UserStore from "../../store/User";
import InformationDialogue from "../InformationDialogue";
import EmojiPicker from "./EmojiPicker";
import UpdateEmailForm from "./UpdateEmailForm";

const mapState = (state: ApplicationState) => {
  return {
    user: state.user,
  };
};

const connector = connect(mapState, UserStore.actionCreators);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {};

const UserSettings = (props: Props) => {
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");

  return (
    <div>
      <h2 className="title is-2 has-text-centered">
        {props.user?.user?.username}
      </h2>

      <div className="section pt-1">
        <h4 className="subtitle is-4 has-text-centered">Settings</h4>
        <label className="label">Scoring</label>
        <div className="field">
          <div className="control">
            <input
              id="simpleScoring"
              type="checkbox"
              name="switchExample"
              className="switch"
              checked={!props.user?.userDetails?.simpleScoring}
              onChange={() => {
                props.setSimpleScoring(!props.user?.userDetails?.simpleScoring);
              }}
            />
            <label htmlFor="simpleScoring">Detailed</label>
          </div>
        </div>
        <br />
        <EmojiPicker />
        <br />
        <UpdateEmailForm
          changeEmail={props.changeEmail}
          currentEmail={props.user?.userDetails?.email}
        />
        <br />
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
      </div>
    </div>
  );
};

export default connector(UserSettings);
