/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import colors from "../colors";
import { ApplicationState } from "../store";
import * as LoginStore from "../store/User";
import "./Login.css";

const mapState = (state: ApplicationState) => state.user;

const connector = connect(mapState, LoginStore.actionCreators);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {};

const Signup = (props: Props) => {
  const [login, setLogin] = useState({ username: "", password: "", email: "" });
  const isFormValid = (username: string, password: string) => {
    if (username.length < 3 || password.length < 5) return true;
    return false;
  };

  if (props.failedLoginMessage) {
    return <div>Loggin failed: {props.failedLoginMessage}</div>;
  }

  return (
    <>
      <div className="section pt-1">
        <h4 className="title is-4">Create account</h4>
        <div className="field">
          <p className="control has-icons-left has-icons-right">
            <input
              className="input"
              style={{ backgroundColor: colors.field }}
              type="text"
              placeholder="Username"
              value={login.username}
              onChange={(e) => setLogin({ ...login, username: e.target.value })}
            />
            <span className="icon is-small is-left">
              <i className="fas fa-envelope"></i>
            </span>
            <span className="icon is-small is-right">
              <i className="fas fa-check"></i>
            </span>
          </p>
        </div>
        <div className="field">
          <p className="control has-icons-left">
            <input
              className="input"
              style={{ backgroundColor: colors.field }}
              type="email"
              placeholder="Email (optional)"
              value={login.email}
              onChange={(e) => setLogin({ ...login, email: e.target.value })}
            />
            <span className="icon is-small is-left">
              <i className="fas fa-envelope"></i>
            </span>
          </p>
        </div>
        <br />
        <div className="field">
          <p className="control has-icons-left">
            <input
              className="input"
              style={{ backgroundColor: colors.field }}
              type="password"
              placeholder="Password"
              value={login.password}
              onChange={(e) => setLogin({ ...login, password: e.target.value })}
            />
            <span className="icon is-small is-left">
              <i className="fas fa-lock"></i>
            </span>
          </p>
        </div>
        <div className="field">
          <div className="control">
            <button
              disabled={isFormValid(login.username, login.password)}
              className="button is-outlined"
              style={{ backgroundColor: colors.button }}
              onClick={() =>
                props.createUser(login.username, login.password, login.email)
              }
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default connector(Signup);
