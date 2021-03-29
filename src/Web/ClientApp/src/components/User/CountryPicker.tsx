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

const CountryPicker = (props: Props) => {
  return (
    <>
      <label className="label">Country</label>
      <div className="field is-grouped">
        <div className="control is-expanded">
          <div className="select">
            <select
              onChange={(e) => {
                props.setCountry(e.target.value);
              }}
              value={props.user?.userDetails?.country || undefined}
              style={{
                backgroundColor: colors.field,
              }}
            >
              <option value={undefined}>Select your country</option>
              {Object.keys(countries).map((c) => (
                <option key={c} value={c}>
                  {countries[c]}
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

export const countries: any = {
  norway: `🇳🇴`,
  sweden: `🇸🇪`,
  usa: `🇺🇸`,
  uk: `🇬🇧`,
  denmark: `🇩🇰`,
  finland: `🇫🇮`,
  rainbow: `🏳️‍🌈`,
  pirate: `️🏴‍☠️`,
  black: `️‍🏴`,
  white: `️🏳️`,
  unknown: `🏁`,
};
export default connector(CountryPicker);
