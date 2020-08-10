import React, { useState, useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { ApplicationState } from "../../store";
import { actionCreators as loginActionCreator } from "../../store/User";
import {
  actionCreators as roundsActionCreator,
  ScoreMode,
} from "../../store/Rounds";
import { CourseInfo } from "../../store/Tournaments";

const mapState = (state: ApplicationState) => {
  return {
    friends: state.user?.friendUsers,
    username: state.user?.user?.username || "",
  };
};

const connector = connect(mapState, {
  ...loginActionCreator,
  ...roundsActionCreator,
});

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & { selectedCourse: CourseInfo };

const NewTournamentRound = (props: Props) => {
  const [showDialog, setShowDialog] = useState(false);
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const { fetchUsers } = props;
  const playerAdded = (playerName: string) => {
    if (selectedPlayers.some((p) => p === playerName)) return;
    setSelectedPlayers([...selectedPlayers, playerName]);
  };
  const removePlayer = (playerName: string) => {
    setSelectedPlayers(selectedPlayers.filter((p) => p !== playerName));
  };

  useEffect(() => {
    showDialog && fetchUsers();
  }, [fetchUsers, showDialog]);

  return (
    <>
      <div className={showDialog ? "modal is-active" : "modal"}>
        <div
          onClick={() => {
            setShowDialog(false);
          }}
        >
          <div className="modal-background"></div>
        </div>
        <div className="modal-card has-text-left">
          <header className="modal-card-head">
            <p className="modal-card-title">Start new round</p>
          </header>
          <section className="modal-card-body">
            <label className="label">Course</label>
            <>
              <div className="field">
                <div className="control">
                  <div className="select is-primary">
                    <select value={props.selectedCourse.name} disabled>
                      <option>{props.selectedCourse.name}</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="field">
                <div className="control">
                  <div className="select is-primary">
                    <select value={props.selectedCourse.layout} disabled>
                      <option>{props.selectedCourse.layout}</option>
                    </select>
                  </div>
                </div>
              </div>
            </>
            <label className="label">Friends</label>
            <div className="field">
              <div className="control">
                <div className="select is-primary">
                  <select onChange={(e) => playerAdded(e.target.value)}>
                    <option></option>
                    {props.friends?.map((u) => (
                      <option key={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <br />
            {selectedPlayers.map((p) => (
              <span
                onClick={() => removePlayer(p)}
                key={p}
                className="tag is-black"
              >
                {p}
                <button className="delete is-small"></button>
              </span>
            ))}
          </section>
          <footer className="modal-card-foot">
            <button
              className="button is-success"
              onClick={() => {
                props.newRound(
                  props.selectedCourse.id,
                  selectedPlayers,
                  "",
                  ScoreMode.DetailedLive
                );
                setShowDialog(false);
              }}
            >
              Start
            </button>
            <button className="button" onClick={() => setShowDialog(false)}>
              Cancel
            </button>
          </footer>
        </div>
      </div>
      <button
        className="button is-primary is-small is-light is-outlined"
        onClick={() => setShowDialog(true)}
      >
        <strong>New Round</strong>
      </button>
    </>
  );
};

export default connector(NewTournamentRound);
