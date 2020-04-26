import React, { useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { ApplicationState } from "../store";
import * as RoundsStore from "../store/Rounds";
import { useParams } from "react-router";

const mapState = (state: ApplicationState) => {
  return {
    rounds: state.rounds && state.rounds,
  };
};

const connector = connect(mapState, RoundsStore.actionCreators);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {};

const HoleScoreSelector = (props: Props) => {
  const { rounds, setScore } = props;

  return rounds && rounds.round ? (
    <div className="panel is-primary">
      <div className="panel-block">
        <div className="field is-grouped">
          {[...Array(4)].map((element, i) => (
            <div className="control" key={i}>
              <button className="button" onClick={() => setScore(i + 2)}>
                {i + 2}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  ) : null;
};

export default connector(HoleScoreSelector);
