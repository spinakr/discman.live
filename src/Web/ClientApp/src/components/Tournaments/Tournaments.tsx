import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { ApplicationState } from "../../store";
import * as TournamentsStore from "../../store/Tournaments";
import { Link } from "react-router-dom";
import NewTournament from "./NewTournament";

const mapState = (state: ApplicationState) => {
  return {
    user: state.user,
    tournaments: state.tournaments?.tournaments,
  };
};

const connector = connect(mapState, TournamentsStore.actionCreators);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & { username?: string };

const toDateString = (date: Date) => {
  const dateTimeFormat = new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  });
  const [
    { value: month },
    ,
    { value: day },
    // { value: year },
    ,
  ] = dateTimeFormat.formatToParts(date);

  return `${day}. ${month.toLowerCase().substr(0, 3)}`;
};

const Tournaments = (props: Props) => {
  const { fetchTournaments, tournaments } = props;
  React.useEffect(() => {
    fetchTournaments(false, props.username);
  }, [fetchTournaments, props.username]);

  return (
    <>
      <h4 className="title is-4 has-text-centered">Tournaments</h4>
      <section className="section pt-0 has-text-centered">
        {(!tournaments || tournaments.length === 0) && (
          <>
            <div>No tournaments</div>
            <br />
          </>
        )}
        {tournaments && (
          <div className="panel">
            {tournaments.map((t) => (
              <Link
                className="panel-block"
                key={t.id}
                to={`/tournaments/${t.id}`}
              >
                <span className="panel-icon">
                  <i className="fas fa-trophy"></i>
                </span>
                <div className="columns is-mobile is-gapless columns-full">
                  <div className="column is-two-thirds">{t.name}</div>
                  <div className="column is-one-third">
                    <i className="is-size-7">
                      {toDateString(new Date(t.start)).substr(0, 2)}
                      {"-"}
                      {toDateString(new Date(t.end))}
                    </i>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <hr />
        <NewTournament />
      </section>
    </>
  );
};

export default connector(Tournaments);
