import React, { useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { ApplicationState } from "../../store";
import * as UserStore from "../../store/User";
import queryString from "query-string";

const mapState = (state: ApplicationState) => {
  return {
    user: state.user,
    location: state.router.location,
  };
};

const connector = connect(mapState, UserStore.actionCreators);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {};

const ResetPassword = (props: Props) => {
  const query = queryString.parse(props.location.search);
  const [password, setPassword] = useState("");
  const resetId = query.resetId as string;
  if (!resetId || resetId.length !== 36) return null;
  return (
    <div className="section">
      <div className="field is-grouped">
        <p className="control has-icons-left">
          <input
            className="input"
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span className="icon is-small is-left">
            <i className="fas fa-lock"></i>
          </span>
        </p>
        <div className="control">
          <button
            disabled={!password || password.length < 6}
            className="button is-success is-light is-outlined"
            onClick={() => props.setPassword(password, resetId)}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default connector(ResetPassword);
