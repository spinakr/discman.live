import React from "react";
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

type Props = PropsFromRedux & { onlyActive?: boolean };

const UserRounds = (props: Props) => {
  const { username } = useParams();
  const { fetchUserRounds, onlyActive } = props;
  React.useEffect(() => {
    fetchUserRounds(10, username);
  }, [fetchUserRounds, username]);
  const rounds = props.user?.userRounds.filter((r) => {
    return !onlyActive || !r.isCompleted;
  });

  if (!rounds || rounds.length === 0)
    return <div className="has-text-centered"> No active rounds</div>;

  return (
    <section className="has-text-centered">
      <div className="panel">
        {rounds.map((r) => (
          <RoundListItem
            key={r.id}
            round={r}
            username={username || props.user?.user?.username || ""}
          />
        ))}
      </div>
    </section>
  );
};

export default connector(UserRounds);
