import React, { useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { ApplicationState } from "../../store";
import * as UserStore from "../../store/User";
import RoundListItem from "../Round/RoundListItem";
import { useParams } from "react-router";

const mapState = (state: ApplicationState) => {
  return {
    user: state.user,
  };
};

const connector = connect(mapState, UserStore.actionCreators);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {};

const UserRounds = (props: Props) => {
  const { usernameParam } = useParams<{ usernameParam: string }>();
  const [page, setPage] = useState(1);
  const { fetchUserRounds } = props;
  React.useEffect(() => {
    fetchUserRounds(page, usernameParam);
  }, [fetchUserRounds, page, usernameParam]);
  const pagedRounds = props.user?.userRounds;

  if (!pagedRounds?.rounds || pagedRounds.rounds.length === 0)
    return <div className="has-text-centered"> No active rounds</div>;

  return (
    <section className="has-text-centered">
      <div className="panel">
        {pagedRounds.rounds.map((r) => (
          <RoundListItem
            key={r.id}
            round={r}
            username={usernameParam || props.user?.user?.username || ""}
          />
        ))}
      </div>
      {pagedRounds.pages > 1 && (
        <nav
          className="pagination is-small is-mobile"
          role="navigation"
          aria-label="pagination"
        >
          <a
            onClick={() => page > 1 && setPage(page - 1)}
            className="pagination-previous"
          >
            <span className="icon">
              <i className="fas fa-chevron-left" aria-hidden="true"></i>
            </span>
          </a>
          <ul className="pagination-list">
            <li>
              <a
                className={`pagination-link ${
                  pagedRounds.pageNumber === 1 && "is-current"
                }`}
                onClick={() => setPage(1)}
                aria-label="Goto page 1"
              >
                1
              </a>
            </li>
            {pagedRounds.pageNumber !== 1 && (
              <>
                <li>
                  <span className="pagination-ellipsis">&hellip;</span>
                </li>
                <li>
                  <a
                    className="pagination-link is-current"
                    aria-label="Goto page 1"
                  >
                    {pagedRounds.pageNumber}
                  </a>
                </li>
              </>
            )}
            {pagedRounds.pages > pagedRounds.pageNumber && (
              <>
                <li>
                  <span className="pagination-ellipsis">&hellip;</span>
                </li>
                <li>
                  <a
                    onClick={() => setPage(pagedRounds.pages)}
                    className="pagination-link"
                    aria-label="Goto page 1"
                  >
                    {pagedRounds.pages}
                  </a>
                </li>
              </>
            )}
          </ul>
          <a
            className="pagination-next"
            onClick={() => page < pagedRounds.pages && setPage(page + 1)}
          >
            <span className="icon">
              <i className="fas fa fa-chevron-right" aria-hidden="true"></i>
            </span>
          </a>
        </nav>
      )}
    </section>
  );
};

export default connector(UserRounds);
