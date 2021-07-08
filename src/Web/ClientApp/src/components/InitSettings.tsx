import React from "react";
import { ApplicationState } from "../store";
import { connect, ConnectedProps } from "react-redux";
import { actionCreators as userActionCreator } from "../store/User";
import colors from "../colors";
import EmojiPicker from "./User/EmojiPicker";
import CountryPicker from "./User/CountryPicker";

export interface News {
  id: string;
  body: (setSeen: (id: string) => void) => JSX.Element;
}

const mapState = (state: ApplicationState) => {
  return {
    user: state.user,
  };
};

const connector = connect(mapState, userActionCreator);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {};

const InitSettings = (props: Props) => {
  const toDisplay = !props.user?.userDetails?.settingsInitialized;
  if (!toDisplay) return null;
  return (
    <div className="modal is-active">
      <div className="modal-background  "></div>
      <div className="modal-card">
        <header
          className="modal-card-head"
          style={{ backgroundColor: colors.background }}
        >
          <p className="modal-card-title">Settings</p>
        </header>
        <section
          style={{
            whiteSpace: "pre-wrap",
            backgroundColor: colors.background,
          }}
          className="modal-card-body"
        >
          <CountryPicker />
          <br />
          <EmojiPicker />
        </section>
        <footer
          className="modal-card-foot"
          style={{ backgroundColor: colors.background }}
        >
          <button
            className="button"
            onClick={() => props.setSettingsInitialized()}
          >
            Finish
          </button>
        </footer>
      </div>
    </div>
  );
};

export default connector(InitSettings);
