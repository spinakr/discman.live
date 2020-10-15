import { StackScreenProps } from "@react-navigation/stack";
import * as React from "react";
import { StyleSheet } from "react-native";
import { ApplicationState } from "../../store";
import { PlayStackParamList } from "../../types";
import * as RoundStore from "../../store/ActiveRound";
import * as UserStore from "../../store/User";
import { connect, ConnectedProps } from "react-redux";
import { View } from "../../components/Themed";
import RoundInfo from "./RoundInfo";
import ScoreSelection from "./ScoreSelection";
import PlayerScores from "./PlayerScores";
import { useState } from "react";
import HoleScore from "./HoleScore";
import { StrokeOutcome } from "../../store/ActiveRound";
import HoleInfo from "./HoleInfo";

const mapState = (state: ApplicationState) => {
  return {
    activeRound: state.activeRound,
    user: state.user,
    courseStats: state.activeRound?.playerCourseStats,
  };
};

const connector = connect(mapState, { ...RoundStore.actionCreators, ...UserStore.actionCreators });

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {} & StackScreenProps<PlayStackParamList, "Live">;
const LiveScreen = ({ activeRound, fetchRound, user, setScore, goToNextHole, goToPreviousHole, fetchStatsOnCourse, courseStats }: Props) => {
  const [edit, setEdit] = useState(false);
  const activeRoundId = user?.userDetails?.activeRound;
  React.useEffect(() => {
    if (activeRoundId) {
      fetchRound(activeRoundId);
      fetchStatsOnCourse(activeRoundId);
    }
  }, [activeRoundId]);
  const saveScore = (strokes: StrokeOutcome[]) => {
    setEdit(false);
    setScore(strokes);
  };
  const round = activeRound?.round;
  const playerScores = round?.playerScores.find((p) => p.playerName === user?.user?.username)?.scores || round?.playerScores[0].scores;
  if (!round || !activeRound || !playerScores) return null;
  const holeScore = playerScores[activeRound.activeHoleIndex];
  const playerCourseStats = courseStats?.find((s) => s.playerName === user?.user?.username);
  if (!holeScore) return null;
  return (
    <View style={styles.container}>
      <RoundInfo holeScore={holeScore} round={round} activeHole={activeRound.activeHoleIndex} />
      <HoleInfo playerCourseStats={playerCourseStats} hole={holeScore.hole} activeHoleNumber={holeScore.hole.number} />
      <View style={styles.scoresSection}>
        <PlayerScores
          playerScores={round?.playerScores}
          activeHoleIndex={activeRound.activeHoleIndex}
          goToNextHole={goToNextHole}
          goToPreviousHole={goToPreviousHole}
        />
      </View>
      <View style={styles.selectorSection}>
        {holeScore.strokes !== 0 && !edit ? (
          <HoleScore holeScore={holeScore} setEdit={setEdit} />
        ) : (
          <ScoreSelection saveScore={saveScore} cancelEdit={edit ? () => setEdit(false) : null} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingBottom: 10 },
  scoresSection: { flex: 3 },
  scoresSubSection: { flex: 1, flexDirection: "row", alignItems: "flex-start", justifyContent: "space-around" },
  selectorSection: { flex: 5 },
});

export default connector(LiveScreen);