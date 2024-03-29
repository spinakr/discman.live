import React, { useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { Link } from "react-router-dom";
import colors from "../colors";
import { ApplicationState } from "../store";
import * as LoginStore from "../store/User";
import "./Login.css";

const mapState = (state: ApplicationState) => state.user;

const connector = connect(mapState, LoginStore.actionCreators);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {};

const Login = (props: Props) => {
  const [login, setLogin] = useState({ username: "", password: "", email: "" });
  const [showResetPw, setShowResetPw] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
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
        <h4 className="title is-4">Login</h4>
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
              type="password"
              placeholder="Password"
              value={login.password}
              onChange={(e) => setLogin({ ...login, password: e.target.value })}
            />
            <span className="icon is-small is-left">
              <i className="fas fa-lock"></i>
            </span>
          </p>
          <a
            className="is-size-7 has-text-weight-light"
            onClick={() => {
              setShowResetPw(true);
            }}
          >
            forgot your password?
          </a>
        </div>
        <div className="field is-grouped">
          <div className="control">
            <button
              disabled={isFormValid(login.username, login.password)}
              className="button is-outlined"
              style={{ backgroundColor: colors.button }}
              onClick={() => props.requestLogin(login.username, login.password)}
            >
              Login
            </button>
          </div>
        </div>
        <hr />
        <p className="is-size-6 has-text-weight-light">
          Don't have an account?<Link to="/signup"> Register here!</Link>
        </p>
        <div className={showResetPw ? "modal is-active" : "modal"}>
          <div
            onClick={() => {
              setShowResetPw(false);
            }}
          >
            <div className="modal-background"></div>
          </div>
          <div className="modal-card">
            <header
              className="modal-card-head"
              style={{
                backgroundColor: colors.background,
              }}
            >
              <p className="modal-card-title">Reset Password</p>
            </header>
            <section
              style={{
                whiteSpace: "pre-wrap",
                backgroundColor: colors.background,
              }}
              className="modal-card-body"
            >
              <div className="field">
                <p className="control has-icons-left has-icons-right">
                  <input
                    className="input"
                    type="text"
                    placeholder="Email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
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
                <button
                  className="button"
                  onClick={() => {
                    props.forgotPassword(resetEmail);
                    setShowResetPw(false);
                    setResetEmail("");
                  }}
                  disabled={resetEmail === "" || !resetEmail}
                >
                  Send
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default connector(Login);
