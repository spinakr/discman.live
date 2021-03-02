/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { ApplicationState } from "../../store";
import * as UserStore from "../../store/User";
import { Link } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";

const mapState = (state: ApplicationState) => {
  return {
    user: state.user,
    feed: state.user?.feed,
  };
};

const connector = connect(mapState, UserStore.actionCreators);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {};

const toDateString = (date: Date) => {
  const dateTimeFormat = new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long",
    day: "2-digit",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  });
  const [
    { value: month },
    ,
    { value: day },
    ,
    ,
    ,
    { value: hour },
    ,
    { value: minute },
  ] = dateTimeFormat.formatToParts(date);

  return `${day}. ${month.toLowerCase()} ${hour}:${minute}`;
};

const getIcon = (item: UserStore.FeedItem) => {
  switch (item.itemType) {
    case "Round":
      return item.action === "Started" ? (
        <i className="fas fa-lg fa-spinner" aria-hidden="true"></i>
      ) : (
        <i className="fas fa-lg fa-check" aria-hidden="true"></i>
      );
    case "Hole":
      return <i className="fas fa-lg fa-crow" aria-hidden="true"></i>;
    case "Achievement":
      return <i className="fas fa-lg fa-star" aria-hidden="true"></i>;
    case "Tournament":
      return <i className="fas fa-lg fa-trophy" aria-hidden="true"></i>;
    case "Friend":
      return <i className="fas fa-lg fa-user-friends" aria-hidden="true"></i>;
    case "User":
      return <i className="fas fa-lg fa-user" aria-hidden="true"></i>;
  }
};

const getScoreName = (relativeScore: number) => {
  switch (relativeScore) {
    case -1:
      return "Birde";
    case -2:
      return "Eagle";
    case -3:
      return "Albatross";
  }
};

const getText = (item: UserStore.FeedItem) => {
  switch (item.itemType) {
    case "User":
      return (
        <span>
          <p className="is-size-7">
            {item.subjects[0]} started using <strong>discman.live</strong> - add
            your friends and start playing!
          </p>
        </span>
      );
    case "Round":
      return (
        <span>
          <p className="is-size-7">
            {item.subjects.join(", ")} {item.action.toLowerCase()} a round at{" "}
            {item.courseName}
          </p>
        </span>
      );
    case "Hole":
      return (
        <span>
          <p className="is-size-7">
            {getScoreName(item.holeScore)} on {item.courseName} hole{" "}
            {item.holeNumber}
          </p>
        </span>
      );
    case "Achievement":
      return (
        <span>
          <p className="is-size-7">
            Earned achievement {item.achievementName}!
          </p>
        </span>
      );
    case "Tournament":
      return (
        <span>
          <p className="is-size-7">
            {item.action === "Joined" && "Signed up for tournament"}{" "}
            {item.tournamentName}!
          </p>
        </span>
      );
    case "Friend":
      return (
        <span>
          <p className="is-size-7">Added {item.friendName} as friend</p>
        </span>
      );
  }
};

const getExtra = (item: UserStore.FeedItem) => {
  if (
    item.itemType === "Round" &&
    item.action === "Completed" &&
    item.roundScores
  ) {
    return (
      <div className="table-container pt-1">
        <table className="table is-narrow has-text-centered has-background-light  is-bordered">
          <tbody>
            <tr>
              {item.subjects.map((s) => (
                <th key={s} className="is-size-7 px-1 py-0">
                  {s}
                </th>
              ))}
            </tr>
            <tr>
              {item.roundScores.map((s, i) => (
                <td key={i} className="is-size-7 px-1 py-0">
                  {+s < 0 ? "-" : "+"}
                  {Math.abs(s)}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
};

const getUri = (item: UserStore.FeedItem) => {
  switch (item.itemType) {
    case "Tournament":
      return `/tournaments/${item.tournamentId}`;
    case "Friend":
      return `/users/${item.friendName}`;
    case "User":
      return `/user`;
    default:
      return `/rounds/${item.roundId}`;
  }
};

const Feed = (props: Props) => {
  const { fetchFeed, feed } = props;
  const [itemType, setItemType] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  React.useEffect(() => {
    fetchFeed(itemType, page);
  }, [fetchFeed, itemType, page]);
  const next = () => {
    setPage(page + 1);
  };

  if (!feed) return null;

  return (
    <section className="">
      <div className="columns is-mobile">
        <div className="column"> </div>
        <div className="column">
          <h3 className="title is-3 has-text-centered">Feed</h3>
        </div>

        <div className="column">
          <div className="field">
            <div className="control">
              <div className="select is-grey is-small">
                <select
                  value={itemType}
                  onChange={(e) => {
                    setPage(1);
                    setItemType(e.target.value);
                  }}
                >
                  <option value="">All</option>
                  <option value="Round">Rounds</option>
                  <option value="Hole">Holes</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      {feed.feedItems.length > 0 && (
        <div className="">
          <InfiniteScroll
            dataLength={feed.feedItems.length} //This is important field to render the next data
            next={next}
            hasMore={!feed.isLastPage}
            loader={<h4>Loading...</h4>}
            // below props only if you need pull down functionality
            refreshFunction={() => setPage(1)}
            pullDownToRefresh
            pullDownToRefreshContent={
              <h3 style={{ textAlign: "center" }}>
                &#8595; Pull down to refresh
              </h3>
            }
            releaseToRefreshContent={
              <h3 style={{ textAlign: "center" }}>
                &#8593; Release to refresh
              </h3>
            }
            pullDownToRefreshThreshold={80}
          >
            {feed.feedItems.map((f) => (
              <div key={f.id} className="box py-1 px-1">
                <article className="media">
                  <Link to={getUri(f)}>
                    <div className="media-left">
                      <span className="icon my-3">{getIcon(f)}</span>
                    </div>
                  </Link>
                  <div className="media-content">
                    <div className="content">
                      <strong>
                        {f.subjects.length === 1 ? f.subjects[0] : "Friends"}
                      </strong>{" "}
                      <small>{toDateString(new Date(f.registeredAt))}</small>
                      <br />
                      <Link to={getUri(f)}>{getText(f)}</Link>
                      {getExtra(f)}
                    </div>
                  </div>

                  <div
                    className="media-left mr-1 mt-3 pl-3"
                    style={{ position: "relative" }}
                    onClick={() => props.toggleLike(f.id)}
                  >
                    {f.likes.length > 0 && (
                      <span className="badge is-bottom-right is-light">
                        {f.likes.length}
                      </span>
                    )}
                    <span
                      className={`icon is-small ${
                        f.likes.some((l) => l === props.user?.user?.username) &&
                        "is-primary"
                      }`}
                    >
                      <i className="fas fa-thumbs-up"></i>
                    </span>
                  </div>
                </article>
              </div>
            ))}
          </InfiniteScroll>
          <br />
        </div>
      )}
    </section>
  );
};

export default connector(Feed);
