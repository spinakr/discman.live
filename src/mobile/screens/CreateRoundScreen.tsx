import { createStackNavigator, StackScreenProps } from "@react-navigation/stack";
import * as React from "react";
import { StyleSheet } from "react-native";
import { connect, ConnectedProps } from "react-redux";
import { ApplicationState } from "../store";
import { PlayStackParamList } from "../types";
import * as CoursesStore from "../store/Courses";
import * as RoundStore from "../store/ActiveRound";
import { useEffect, useRef, useState } from "react";
import { View, Text } from "../components/Themed";
import CommonNavHeader from "../navigation/CommonNavHeader";
import { BottomSheet, Button, CheckBox, Divider, Icon, ListItem, SearchBar } from "react-native-elements";
import debounce from "lodash.debounce";
import { Course } from "../store/Courses";
import { ScrollView } from "react-native-gesture-handler";

const mapState = (state: ApplicationState) => {
  return {
    activeRound: state.user?.userDetails?.activeRound,
    friends: state.user?.userDetails?.friends,
    courses: state.courses?.courses.slice(0, 4),
  };
};

const connector = connect(mapState, { ...CoursesStore.actionCreators, ...RoundStore.actionCreators });

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {} & StackScreenProps<PlayStackParamList, "CreateRound">;

const CreateRoundScreen = ({ navigation, fetchCourses, courses, friends, newRound }: Props) => {
  useEffect(() => {
    fetchCourses("");
  }, []);
  const [searchString, setSearchString] = useState("");
  const searchCourses = useRef(
    debounce((searchString: string) => {
      fetchCourses(searchString);
    }, 1000)
  ).current;
  const onSearchChange = (searchString: string) => {
    setSearchString(searchString);
    searchCourses(searchString);
  };

  const [selectedCourse, setSelectedCourse] = useState<string | undefined>();
  const [availableLayouts, setAvailableLayouts] = useState<Course[] | undefined>();
  const selectCourse = (course: [string, CoursesStore.Course[]]) => {
    setSelectedCourse(course[0]);
    setSelectedLayout(undefined);
    const layouts = course[1];
    if (layouts.length > 1) {
      setAvailableLayouts(course[1]);
    } else {
      setSelectedLayout(course[1][0]);
    }
  };
  const [selectedLayout, setSelectedLayout] = useState<Course | undefined>();

  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);

  return (
    <View style={styles.container}>
      <View style={styles.courseSelection}>
        <Text style={styles.titleText}>Course</Text>
        <SearchBar platform="ios" placeholder="Search existing courses" onChangeText={(text) => onSearchChange(text)} value={searchString} />
        <ScrollView>
          {!selectedCourse ? (
            courses?.map((c) => (
              <ListItem
                key={c[0]}
                bottomDivider
                onPress={() => {
                  selectCourse(c);
                }}
                containerStyle={c[0] === selectedCourse ? {} : {}}
              >
                <ListItem.Content>
                  <ListItem.Title>
                    {c[0]} {c[1].length > 1 ? `(${c[1].length} layouts)` : ""}
                  </ListItem.Title>
                </ListItem.Content>
              </ListItem>
            ))
          ) : (
            <ListItem bottomDivider containerStyle={{}}>
              <ListItem.Content>
                <ListItem.Title style={{ color: "#2089dc", fontSize: 25 }}>{selectedCourse}</ListItem.Title>
                <ListItem.Subtitle>
                  {"     "}
                  {selectedLayout?.layout}
                </ListItem.Subtitle>
              </ListItem.Content>
              <Icon
                name="cancel"
                onPress={() => {
                  setSelectedLayout(undefined);
                  setSelectedCourse(undefined);
                }}
              />
            </ListItem>
          )}
        </ScrollView>
        {selectedCourse && !selectedLayout && availableLayouts && (
          <BottomSheet isVisible={true} modalProps={{}}>
            {availableLayouts.map((l, i) => (
              <ListItem
                key={i}
                containerStyle={{}}
                onPress={() => {
                  setSelectedLayout(l);
                }}
              >
                <ListItem.Content>
                  <ListItem.Title style={{}}>{l.layout}</ListItem.Title>
                </ListItem.Content>
              </ListItem>
            ))}
            <ListItem containerStyle={{ backgroundColor: "#ffcccb" }} onPress={() => setSelectedCourse(undefined)}>
              <ListItem.Content>
                <ListItem.Title style={{ fontSize: 10 }}>Cancel</ListItem.Title>
              </ListItem.Content>
            </ListItem>
          </BottomSheet>
        )}
      </View>
      <View style={styles.friendsSelection}>
        <Text style={styles.titleText}>Friends</Text>
        <ScrollView>
          {selectedFriends.map((f, i) => {
            return <CheckBox key={i} title={f} checked={true} onPress={() => setSelectedFriends(selectedFriends.filter((s) => s !== f))} />;
          })}
          {friends?.map((f, i) => {
            if (selectedFriends.some((s) => s === f)) return null;
            return <CheckBox key={i} title={f} checked={false} onPress={() => setSelectedFriends([...selectedFriends, f])} />;
          })}
        </ScrollView>
      </View>
      <View style={styles.buttonSection}>
        <Button title="Start Round" disabled={!selectedLayout} onPress={() => newRound(selectedLayout?.id, selectedFriends)} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  layoutText: { fontSize: 15 },
  courseText: { fontSize: 20 },
  titleText: { fontSize: 30, alignSelf: "center" },
  courseSelection: { flex: 5 },
  friendsSelection: { flex: 4 },
  buttonSection: { flex: 2, alignItems: "center", justifyContent: "center" },
});

const Stack = createStackNavigator<{ CreateRound: undefined }>();

const StackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="CreateRound" screenOptions={{ header: () => <CommonNavHeader title="New Round" /> }}>
      <Stack.Screen name="CreateRound" component={connector(CreateRoundScreen)} />
    </Stack.Navigator>
  );
};

export default StackNavigator;
