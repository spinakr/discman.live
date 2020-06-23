import React, { useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { ApplicationState } from "../../store";
import { actionCreators as roundsActionCreator } from "../../store/Rounds";

const mapState = (state: ApplicationState) => {
  return {
    round: state.rounds?.round,
    playersCourseStats: state.rounds?.playerCourseStats,
  };
};

const connector = connect(mapState, roundsActionCreator);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {};

const PlayerCourseImprovments = (props: Props) => {
  const { playersCourseStats, round, fetchStatsOnCourse } = props;
  const roundId = round?.id;
  const courseName = round?.courseName;
  useEffect(() => {
    if (!playersCourseStats && roundId && courseName)
      fetchStatsOnCourse(roundId);
  }, [courseName, fetchStatsOnCourse, playersCourseStats, round, roundId]);

  if (!playersCourseStats) return null;
  return (
    <table className="table is-narrow is-striped">
      <thead>
        <tr>
          <th>Player</th>
          <th
            className="has-tooltip-info"
            data-tooltip={`Player average score on ${courseName} \n over the last 5 rounds`}
          >
            Avg.
          </th>
          <th
            className="has-tooltip-info"
            data-tooltip={`Improvement versus personal average \n on ${courseName}`}
          >
            Impr.
          </th>
        </tr>
      </thead>
      <tbody>
        {playersCourseStats.map((s) => {
          const improv = Math.round(s.thisRoundVsAverage);
          const courseAvg = Math.round(s.courseAverage);
          return (
            <tr key={s.playerName}>
              <td>{s.playerName}</td>
              <td>
                {courseAvg > 0 ? "+" : courseAvg < 0 ? " - " : ""}
                {Math.abs(courseAvg)}
              </td>
              <td
                className={
                  improv > 0
                    ? "has-text-danger"
                    : improv < 0
                    ? "has-text-primary"
                    : ""
                }
              >
                {improv > 0 ? "+" : improv < 0 ? " - " : ""}
                {Math.abs(improv)}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default connector(PlayerCourseImprovments);
