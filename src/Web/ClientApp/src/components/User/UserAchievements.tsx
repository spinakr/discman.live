import React, { useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { ApplicationState } from "../../store";
import * as UserStore from "../../store/User";
import { useParams } from "react-router";
import Achievement from "../Achievement";

const mapState = (state: ApplicationState) => {
  return {
    user: state.user,
  };
};

const connector = connect(mapState, UserStore.actionCreators);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {};

const UserAchievementsComponent = (props: Props) => {
  const { username } = useParams();
  const { fetchUserAchievements, user } = props;
  useEffect(() => {
    fetchUserAchievements(username);
  }, [fetchUserAchievements, username]);
  const achievements = user?.userAchievements;

  return (
    <>
      <div className="section columns is-centered pt-0">
        <div className="column is-one-third">
          {achievements &&
            achievements.map((a) => (
              <Achievement
                key={`${a.achievement.achievementName}${a.achievement.username}`}
                achievement={a.achievement}
                count={a.count}
              />
            ))}
        </div>
      </div>
    </>
  );
};

export default connector(UserAchievementsComponent);
