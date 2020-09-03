import React, { useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { ApplicationState } from "../store";
import * as LoginStore from "../store/User";
import "./Login.css";

const mapState = (state: ApplicationState) => state.user;

const connector = connect(mapState, LoginStore.actionCreators);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {};

const Login = (props: Props) => {
  const [login, setLogin] = useState({ username: "", password: "", email: "" });
  const isFormValid = (username: string, password: string) => {
    if (username.length < 3 || password.length < 5) return true;
    return false;
  };

  if (props.failedLoginMessage) {
    return <div>Loggin failed: {props.failedLoginMessage}</div>;
  }

  return (
    <div className="section columns is-centered">
      <div className="column is-4">
        <div className="field">
          <p className="control has-icons-left has-icons-right">
            <input
              className="input"
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
        <div className="field is-grouped">
          <div className="control">
            <button
              disabled={isFormValid(login.username, login.password)}
              className="button is-success is-light is-outlined"
              onClick={() => props.requestLogin(login.username, login.password)}
            >
              Login
            </button>
          </div>
          <div className="control">
            <button
              disabled={isFormValid(login.username, login.password)}
              className="button is-warning is-light is-outlined"
              onClick={() => props.createUser(login.username, login.password)}
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default connector(Login);
