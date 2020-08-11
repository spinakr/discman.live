/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { ApplicationState } from "../../store";
import * as TournamentsStore from "../../store/Tournaments";
import { useParams } from "react-router";
import AddCourse from "./AddCourse";
import { CopyToClipboard } from "react-copy-to-clipboard";
import TournamentLeaderboard from "./TournamentLeaderboard";
import NewTournamentRound from "./NewTournamentRound";

const mapState = (state: ApplicationState) => {
  return {
    user: state.user,
    tournament: state.tournaments?.selectedTournament,
  };
};

const connector = connect(mapState, TournamentsStore.actionCreators);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & { onlyActive?: boolean };

const Tournament = (props: Props) => {
  let { tournamentId } = useParams();
  const { fetchTournament, tournament } = props;
  const [copied, setCopied] = useState(false);
  React.useEffect(() => {
    tournamentId && fetchTournament(tournamentId);
  }, [fetchTournament, tournamentId]);
  const [active, setActive] = useState(1);

  useEffect(() => {
    if (tournament?.info.hasStarted) {
      setActive(2);
    }
  }, [tournament]);

  if (!tournament) return null;

  const playerCoursesPlayed =
    tournament.leaderboard &&
    tournament.leaderboard.scores.find(
      (s) => s.name === props.user?.user?.username
    )?.coursesPlayed;

  return (
    <>
      <h1 className="title has-text-centered">{tournament.info.name}</h1>
      <h2 className="subtitle has-text-centered">
        {new Date(tournament.info.start).toLocaleDateString()}
        {" - "}
        {new Date(tournament.info.end).toLocaleDateString()}
      </h2>

      <div className="tabs is-centered">
        <ul>
          <li
            className={active === 1 ? "is-active" : ""}
            onClick={() => setActive(1)}
          >
            <a>Info</a>
          </li>
          <li
            className={active === 2 ? "is-active" : ""}
            onClick={() => setActive(2)}
          >
            <a>Leaderboard</a>
          </li>
        </ul>
      </div>

      <section className="section has-text-centered py-0">
        {active === 1 && (
          <>
            {!tournament.info.isCompleted &&
              !tournament.info.players.some(
                (p) => p === props.user?.user?.username
              ) && (
                <>
                  <button
                    className="button is-primary is-light is-outlined"
                    onClick={() =>
                      tournamentId && props.addPlayerToTournament(tournamentId)
                    }
                    disabled={!tournamentId}
                  >
                    <strong>Sign up!</strong>
                  </button>
                  <hr />
                </>
              )}
            <div className="columns is-mobile">
              <div className="column "></div>
              <div className="column ">
                <h5 className="subtitle is-5 has-text-centered">Courses</h5>
              </div>
              <div className="column">
                {!tournament.info.isCompleted &&
                  tournament.info.admins.some(
                    (a) => a === props.user?.user?.username
                  ) && <AddCourse />}
              </div>
            </div>
            <div className="panel">
              {tournament.info.courses.map((c) => {
                return (
                  <span className="panel-block" key={c.id}>
                    <div className="level is-mobile">
                      <div className="level-left">
                        <a
                          className="level-item"
                          href={`/courses/${c.name}/${c.layout}`}
                        >
                          {c.name} -<i>&nbsp;{c.layout}</i>
                        </a>
                      </div>
                      <div className="level-right">
                        {playerCoursesPlayed &&
                        playerCoursesPlayed.some((pc) => pc === c.id) ? (
                          <span className="icon level-item has-text-success">
                            <i className="fas fa-check-square"></i>
                          </span>
                        ) : (
                          !tournament.info.isCompleted && (
                            <NewTournamentRound selectedCourse={c} />
                          )
                        )}
                      </div>
                    </div>
                  </span>
                );
              })}
            </div>
            <div className="columns is-mobile">
              <div className="column "></div>
              <div className="column ">
                <h5 className="subtitle is-5 has-text-centered">Players</h5>
              </div>
              <div className="column ">
                {!copied ? (
                  <CopyToClipboard
                    text={`https://discman.live/tournaments/${tournamentId}`}
                    onCopy={() => setCopied(true)}
                  >
                    <button className="button is-primary is-small is-light is-outlined">
                      <strong>Copy link</strong>
                    </button>
                  </CopyToClipboard>
                ) : (
                  <span className="tag is-success is-medium is-light">
                    Copied!
                  </span>
                )}
              </div>
            </div>

            <div className="panel">
              {tournament.info.players.map((p) => {
                return (
                  <a className="panel-block" key={p} href={`/users/${p}`}>
                    {p}
                  </a>
                );
              })}
            </div>
          </>
        )}
        {active === 2 && tournament.leaderboard && (
          <TournamentLeaderboard tournament={tournament} />
        )}
      </section>
    </>
  );
};

export default connector(Tournament);
