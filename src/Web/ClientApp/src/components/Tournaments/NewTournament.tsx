import React, { useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { ApplicationState } from "../../store";
import { actionCreators as tournamentsActionCreator } from "../../store/Tournaments";
// import "bulma-calendar/dist/js/bulma-calendar.min.js";

const mapState = (state: ApplicationState) => {
  return {
    courses: state.courses?.courses,
    friends: state.user?.userDetails?.friends,
    username: state.user?.user?.username || "",
  };
};

const connector = connect(mapState, {
  ...tournamentsActionCreator,
});

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {};

const NewTournament = (props: Props) => {
  const [showDialog, setShowDialog] = useState(false);
  const [tournamentName, setTournamentName] = useState("");
  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date());
  const { createTournament } = props;

  const toIsoDate = (date: Date) => {
    var year = date.getFullYear();
    var month = "" + (date.getMonth() + 1);
    var dt = "" + date.getDate();

    if (date.getDate() < 10) {
      dt = "0" + dt;
    }
    if (date.getMonth() + 1 < 10) {
      month = "0" + month;
    }
    return `${year}-${month}-${dt}`;
  };
  return (
    <>
      <div className={showDialog ? "modal is-active" : "modal"}>
        <div onClick={() => setShowDialog(false)}>
          <div className="modal-background"></div>
        </div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Create new tournament</p>
          </header>
          <section className="modal-card-body">
            <label className="label">Tournament name</label>
            <div className="field">
              <div className="control">
                <input
                  className="input"
                  type="text"
                  value={tournamentName}
                  onChange={(e) => setTournamentName(e.target.value)}
                ></input>
              </div>
            </div>
            <label className="label">Start date</label>
            <div className="field">
              <div className="control">
                <input
                  className="input"
                  type="date"
                  value={toIsoDate(start)}
                  onChange={(e) => setStart(new Date(e.target.value))}
                ></input>
              </div>
            </div>
            <label className="label">End date</label>
            <div className="field">
              <div className="control">
                <input
                  className="input"
                  type="date"
                  value={toIsoDate(end)}
                  onChange={(e) => setEnd(new Date(e.target.value))}
                ></input>
              </div>
            </div>
          </section>
          <footer className="modal-card-foot">
            <button
              className="button is-success is-light is-outlined"
              onClick={() => {
                createTournament(tournamentName, start, end);
                setShowDialog(false);
              }}
              disabled={!tournamentName}
            >
              Create
            </button>
            <button className="button" onClick={() => setShowDialog(false)}>
              Cancel
            </button>
          </footer>
        </div>
      </div>
      <button
        className="button is-primary is-light is-outlined"
        onClick={() => setShowDialog(true)}
      >
        <strong>New Tournament</strong>
      </button>
    </>
  );
};

export default connector(NewTournament);
