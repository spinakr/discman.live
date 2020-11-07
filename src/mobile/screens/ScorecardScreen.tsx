import * as React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { ApplicationState } from "../store";
import { connect, ConnectedProps } from "react-redux";
import * as UserStore from "../store/User";
import { View, Text } from "../components/Themed";
import { PlayerScore, StrokeSpec } from "../store/ActiveRound";
import { addOrientationChangeListener, getOrientationAsync, Orientation } from "expo-screen-orientation";
import { useEffect, useState } from "react";
import ProgressCircle from "react-native-progress-circle";

const mapState = (state: ApplicationState) => {
  return {
    activeRound: state.activeRound,
    user: state.user,
  };
};

const connector = connect(mapState, UserStore.actionCreators);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {};

const scoreStyle = (relativeToPar: number, specs: StrokeSpec[]) => {
  switch (relativeToPar) {
    case -1:
      return styles.birdieCell;
    case 1:
      return styles.bogeyCell;
    case -2:
      return styles.eagleCell;
    case 0:
      return {};
    default:
      return styles.multipleCell;
  }
};

const renderScoresPart = (scores: PlayerScore[], from: number, to: number) => {
  const firstScores = scores[0].scores.slice(from, to);
  if (firstScores.length === 0) return null;
  return (
    <>
      <View style={styles.headerRow}>
        <View style={styles.playerNameCell}>
          <Text style={{}}></Text>
        </View>
        {firstScores.map((h, i) => (
          <View style={styles.cell} key={i}>
            <Text style={{ fontSize: 15, fontWeight: "bold" }}>{h.hole.number}</Text>
            <Text style={{ fontSize: 10, fontStyle: "italic" }}>{h.hole.distance}</Text>
            <Text style={{ fontSize: 12 }}>{h.hole.par}</Text>
          </View>
        ))}
      </View>

      {scores.map((p) => {
        const totalScore = p.scores.reduce((total, score) => {
          return total + score.relativeToPar;
        }, 0);

        return (
          <View style={[styles.scoresRow]} key={p.playerName}>
            <View style={[styles.playerNameCell]}>
              <Text numberOfLines={1} style={{}}>
                {p.playerName}
              </Text>
            </View>
            {p.scores.slice(from, to).map((s) => {
              return (
                <View
                  key={s.hole.number}
                  style={[
                    styles.cell,
                    scoreStyle(s.relativeToPar, s.strokeSpecs),
                    s.strokeSpecs && s.strokeSpecs.some((x) => +x.outcome === 2) && { borderBottomColor: "red" },
                  ]}
                >
                  <View style={[{ flex: 1, backgroundColor: "transparent" }]}>
                    <Text style={{}}>{s.strokes}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        );
      })}
    </>
  );
};

const ScorecardScreen = ({ activeRound, user }: Props) => {
  const [orientation, setOrientation] = useState(Orientation.PORTRAIT_UP);
  useEffect(() => {
    getOrientationAsync().then((o) => {
      setOrientation(o);
    });
    addOrientationChangeListener((o) => {
      setOrientation(o.orientationInfo.orientation);
    });
  }, []);

  const round = activeRound?.round;
  const playerScores = round?.playerScores.find((p) => p.playerName === user?.user?.username)?.scores || round?.playerScores[0].scores;
  const scores = round?.playerScores.sort((a, b) => {
    const aTotal = a.scores.reduce((total, score) => {
      return total + score.relativeToPar;
    }, 0);
    const bTotal = b.scores.reduce((total, score) => {
      return total + score.relativeToPar;
    }, 0);
    return aTotal - bTotal;
  });

  const roundStats = activeRound?.finishedRoundStats;
  const courseStats = activeRound?.playerCourseStats;
  if (!playerScores || !scores) return null;
  return (
    <ScrollView style={[styles.container, {}]}>
      <View style={styles.scoreboardSection}>
        <View style={styles.scoreBoardRowHeader}>
          <View style={styles.scoreBoardCell}></View>
          <View style={styles.scoreBoardCell}>
            <Text>Score</Text>
          </View>
          <View style={styles.scoreBoardCell}>
            <Text>Vs. avg.</Text>
          </View>
          <View style={styles.scoreBoardCell}>
            <Text>Vs. best</Text>
          </View>
        </View>
        {scores.map((s) => {
          const totalScore = s.scores.reduce((total, score) => {
            return total + score.relativeToPar;
          }, 0);
          const courseStat = courseStats?.find((c) => c.playerName === s.playerName);
          if (!courseStat) return null;
          return (
            <View style={styles.scoreBoardRow} key={s.playerName}>
              <View style={styles.scoreBoardNameCell}>
                <Text numberOfLines={1}>{s.playerName}</Text>
              </View>
              <View style={styles.scoreBoardCell}>
                <Text>{totalScore}</Text>
              </View>
              <View style={styles.scoreBoardCell}>
                <Text>{courseStat.thisRoundVsAverage.toFixed(0)}</Text>
              </View>
              <View style={styles.scoreBoardCell}>
                <Text>{courseStat.playerCourseRecord - totalScore}</Text>
              </View>
            </View>
          );
        })}
      </View>
      <View style={styles.scorecardSection}>
        {orientation === Orientation.LANDSCAPE_LEFT || orientation === Orientation.LANDSCAPE_RIGHT ? (
          renderScoresPart(scores, 0, 27)
        ) : (
          <>
            {renderScoresPart(scores, 0, 9)}
            {renderScoresPart(scores, 9, 18)}
            {renderScoresPart(scores, 18, 27)}
          </>
        )}
      </View>
      {/* <View style={styles.statsSection}>
        {roundStats?.map((s) => (
          <ProgressCircle percent={30} radius={50} borderWidth={8} color="#3399FF" shadowColor="#999" bgColor="#fff">
            <Text style={{ fontSize: 18 }}>{"30%"}</Text>
          </ProgressCircle>
        ))}
      </View> */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scoreboardSection: { flex: 1, paddingTop: 30 },
  scoreBoardRow: { flex: 1, flexDirection: "row", borderBottomColor: "lightgrey", borderBottomWidth: 1 },
  scoreBoardCell: { flex: 1, alignItems: "center", borderRightWidth: 1, borderRightColor: "lightgrey", padding: 2 },
  scoreBoardNameCell: { flex: 1, borderRightWidth: 1, borderRightColor: "lightgrey", padding: 2 },
  scoreBoardRowHeader: { flex: 1, flexDirection: "row", borderBottomColor: "lightgrey", borderBottomWidth: 2 },
  scorecardSection: { flex: 1 },
  statsSection: { flex: 1 },
  scoresRow: { flex: 1, flexDirection: "row", borderColor: "lightgrey", borderBottomWidth: 1 },
  headerRow: { flex: 1, flexDirection: "row", marginTop: 10, borderColor: "lightgrey", borderBottomWidth: 3, borderTopWidth: 1 },
  cell: {
    flex: 1,
    borderBottomWidth: 3,
    borderColor: "transparent",
    borderLeftColor: "lightgrey",
    borderLeftWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
  },
  playerNameCell: { flex: 3, justifyContent: "center", paddingLeft: 5 },
  totalScoreCell: { flex: 2, justifyContent: "center" },
  birdieCell: { backgroundColor: "lightgreen" },
  bogeyCell: { backgroundColor: "orange" },
  eagleCell: { backgroundColor: "green" },
  multipleCell: { backgroundColor: "darkorange" },
});

export default connector(ScorecardScreen);
