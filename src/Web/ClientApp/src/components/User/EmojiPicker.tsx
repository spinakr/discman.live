import React from "react";
import { connect, ConnectedProps } from "react-redux";
import colors from "../../colors";
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

const EmojiPicker = (props: Props) => {
  return (
    <>
      <label className="label">Emoji</label>
      <span className="is-5 is-italic is-light">
        Personal emoji, used in scorecards etc.
      </span>
      <div className="field is-grouped">
        <div className="control is-expanded">
          <div className="select">
            <select
              onChange={(e) => {
                props.setEmoji(e.target.value);
              }}
              value={props.user?.userDetails?.emoji || undefined}
              style={{
                backgroundColor: colors.field,
              }}
            >
              <option value={undefined}>Select your emoji</option>
              {emojis.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </>
  );
  //   return <span style={{ fontSize: "50px" }}>&#127814;</span>;
};

const emojis = [
  `\u{1F346}`,
  `\u{1F345}`,
  `\u{1F344}`,
  `\u{1F34D}`,
  `\u{1F34E}`,
  `\u{1F351}`,
  `\u{1F354}`,
  `\u{1F357}`,
  `\u{1F981}`,
  `\u{23F0}`,
  `\u{2615}`,
  `\u{26BD}`,
  `\u{1F250}`,
  `\u{1F308}`,
  `\u{1F31A}`,
  `\u{1F32D}`,
  `\u{1F32E}`,
  `\u{1F32F}`,
  `\u{1F33D}`,
  `\u{1F355}`,
  `\u{1F369}`,
  `\u{1F377}`,
  `\u{1F37A}`,
  `\u{1F3A9}`,
  `\u{1F3CB}`,
  `\u{1F401}`,
  `\u{1F409}`,
  `\u{1F40D}`,
  `\u{1F47D}`,
  `\u{1F47E}`,
  `\u{1F485}`,
  `\u{1F489}`,
  `\u{1F48B}`,
  `\u{1F4B0}`,
  `\u{1F595}`,
  `\u{1F596}`,
  `\u{1F63E}`,
  `\u{1F680}`,
  `\u{1F696}`,
  `\u{1F95A}`,
  `\u{1F37E}`,
];

export default connector(EmojiPicker);
