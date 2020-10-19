import * as React from "react";
import { View, Text } from "../../components/Themed";
import { HoleScore, PlayerScore, Round } from "../../store/ActiveRound";
import { StyleSheet } from "react-native";
import { useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";

export interface PlayersRegisterStatusProps {
  playersScores: PlayerScore[];
  activeHoleNumber: number;
}
// const PlayersRegisterStatus = ({ playersScores, activeHoleNumber }: PlayersRegisterStatusProps) => {
//   const [name, setName] = useState("");
//   return (
//     <View style={styles.container}>
//       <View style={styles.nameRow}>
//         <Text style={styles.nameText}>{name}</Text>
//       </View>
//       <View style={styles.row}>
//         {playersScores.map((p) => {
//           const playerScore = p.scores.find((s) => s.hole.number === activeHoleNumber)?.strokes || 0;
//           return (
//             <TouchableOpacity style={styles.statusView} onPressIn={() => setName(p.playerName)} onPressOut={() => setName("")}>
//               <View style={{ ...styles.statusBadge, backgroundColor: playerScore !== 0 ? "green" : "red" }}></View>
//             </TouchableOpacity>
//           );
//         })}
//       </View>
//     </View>
//   );
// };

const PlayersRegisterStatus = ({ playersScores, activeHoleNumber }: PlayersRegisterStatusProps) => {
  return (
    <View style={styles.row}>
      {playersScores.map((p) => {
        const playerScore = p.scores.find((s) => s.hole.number === activeHoleNumber)?.strokes || 0;
        return (
          <TouchableOpacity style={styles.statusView}>
            <View style={{ ...styles.statusBadge, backgroundColor: playerScore !== 0 ? "green" : "red" }}>
              <Text>{p.playerName}</Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  nameRow: { flex: 1, flexDirection: "row", justifyContent: "space-evenly" },
  row: { flex: 2, flexDirection: "row", justifyContent: "space-evenly" },
  statusBadge: { width: 30, height: 30, borderRadius: 15 },
  nameText: { fontSize: 30 },
  statusView: { alignItems: "center", flex: 1 },
});

export default PlayersRegisterStatus;
