import * as React from "react";
import { View, Text } from "../../components/Themed";
import { HoleScore, PlayerScore, Round, StrokeSpec } from "../../store/ActiveRound";
import { StyleSheet } from "react-native";
import GestureRecognizer from "react-native-swipe-gestures";
import DiscgolfBasketIcon from "../../components/DiscgolfBasketIcon";
import { useState } from "react";
import { addOrientationChangeListener, getOrientationAsync, Orientation } from "expo-screen-orientation";
import { useEffect } from "react";

export interface ScoreCardProps {
  scores: PlayerScore[];
}

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

      {scores.map((p, i) => {
        return (
          <View style={[styles.scoresRow]} key={i}>
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

const ScoreCard = ({ scores }: ScoreCardProps) => {
  const [orientation, setOrientation] = useState(Orientation.PORTRAIT_UP);
  useEffect(() => {
    getOrientationAsync().then((o) => {
      setOrientation(o);
    });
    addOrientationChangeListener((o) => {
      setOrientation(o.orientationInfo.orientation);
    });
  }, []);

  const sortedScores = scores.sort((a, b) => {
    const aTotal = a.scores.reduce((total, score) => {
      return total + score.relativeToPar;
    }, 0);
    const bTotal = b.scores.reduce((total, score) => {
      return total + score.relativeToPar;
    }, 0);
    return aTotal - bTotal;
  });

  return (
    <>
      {orientation === Orientation.LANDSCAPE_LEFT || orientation === Orientation.LANDSCAPE_RIGHT ? (
        renderScoresPart(sortedScores, 0, 27)
      ) : (
        <>
          {renderScoresPart(sortedScores, 0, 9)}
          {renderScoresPart(sortedScores, 9, 18)}
          {renderScoresPart(sortedScores, 18, 27)}
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  birdieCell: { backgroundColor: "lightgreen" },
  bogeyCell: { backgroundColor: "orange" },
  eagleCell: { backgroundColor: "green" },
  multipleCell: { backgroundColor: "darkorange" },
  scoresRow: { flex: 1, flexDirection: "row", borderColor: "lightgrey", borderBottomWidth: 1 },
  headerRow: { flex: 1, flexDirection: "row", borderColor: "lightgrey", borderBottomWidth: 3, borderTopWidth: 1 },
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
});

export default ScoreCard;
