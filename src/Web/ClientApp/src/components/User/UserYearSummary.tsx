/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { ApplicationState } from "../../store";
import * as UserStore from "../../store/User";
import { useParams } from "react-router";

const mapState = (state: ApplicationState) => {
  return {
    user: state.user,
  };
};

const connector = connect(mapState, UserStore.actionCreators);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {};

const UserYearSummary = (props: Props) => {
  const { usernameParam, yearParam } = useParams<{
    usernameParam: string | undefined;
    yearParam: string | undefined;
  }>();
  const username = usernameParam || props.user?.user?.username;
  const year = parseInt(yearParam) || new Date().getFullYear();
  const { fetchUserYearSummary } = props;
  useEffect(() => {
    username && fetchUserYearSummary(username, year);
  }, []);
  const yearSummary = props.user?.userYearSummary;

  return (
    <div>
      <h3 className="title is-3 has-text-centered">
        {username}&nbsp;-&nbsp;{year}
      </h3>
      <div className="section pt-0">
        {yearSummary && (
          <div className="">
            <p className="is-size-4">
              In {year} you played <b>{yearSummary.roundsPlayed}</b> rounds, for
              a total of <b>{yearSummary.hoursPlayed.toFixed(1)}</b> hours of
              discgolf! Your total score was{" "}
              {yearSummary.totalScore > 0 ? "+" : "-"}
              {Math.abs(yearSummary.totalScore).toFixed(1)}.
            </p>
            <br />
            <p className="is-size-4">
              You played best when you had <b>{yearSummary.bestCardmate}</b> on
              your card, with an average score of{" "}
              <b>
                {yearSummary.bestCardmateAverageScore > 0 ? "+" : "-"}
                {Math.abs(yearSummary.bestCardmateAverageScore).toFixed(1)}
              </b>{" "}
              per round! While <b>{yearSummary.worstCardmate}</b> is holding you
              back - &nbsp;
              <b>
                {yearSummary.worstCardmateAverageScore > 0 ? "+" : "-"}
                {Math.abs(yearSummary.worstCardmateAverageScore).toFixed(1)}
              </b>{" "}
              per round, when playing with him/her!
            </p>
            <br />
            <p className="is-size-4">
              Your most played course was <b>{yearSummary.mostPlayedCourse}</b>{" "}
              where you played <b>{yearSummary.mostPlayedCourseRoundsCount}</b>{" "}
              rounds.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default connector(UserYearSummary);
