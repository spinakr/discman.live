import React, { useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { ApplicationState } from "../store";
import { actionCreators as coursesActionCreator } from "../store/Courses";
import { actionCreators as loginActionCreator } from "../store/User";
import { actionCreators as roundsActionCreator } from "../store/Rounds";

const mapState = (state: ApplicationState) => {
  return {
    courses: state.courses?.courses,
    friends: state.user?.friendUsers,
    username: state.user?.user?.username || "",
  };
};

const connector = connect(mapState, {
  ...coursesActionCreator,
  ...loginActionCreator,
  ...roundsActionCreator,
});

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {};

const AddFriends = (props: Props) => {
  const [friendName, setFrindName] = useState("");
  return (
    <div className="field has-addons">
      <div className="control ">
        <input
          className="input is-expanded"
          value={friendName}
          onChange={(e) => setFrindName(e.target.value)}
          type="text"
          placeholder="Username"
        />
      </div>
      <div className="control">
        <button
          className="button is-info"
          onClick={() => {
            props.addFriend(friendName);
            setFrindName("");
          }}
          disabled={!friendName}
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default connector(AddFriends);
