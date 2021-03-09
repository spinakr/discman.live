import React, { useState, useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import colors from "../../../colors";
import { ApplicationState } from "../../../store";
import {
  actionCreators as coursesActionCreator,
  Course,
} from "../../../store/Courses";
import AddFriends from "../../AddFriends";

const mapState = (state: ApplicationState) => {
  return {
    courses: state.courses?.courses,
    friends: state.user?.userDetails?.friends,
    username: state.user?.user?.username || "",
  };
};

const connector = connect(mapState, {
  ...coursesActionCreator,
});

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  setSelectedPlayers: React.Dispatch<React.SetStateAction<string[]>>;
  selectedPlayers: string[];
};

const PlayersSelector = ({
  selectedPlayers,
  setSelectedPlayers,
  friends,
}: Props) => {
  const togglePlayer = (playerName: string) => {
    if (selectedPlayers.some((p) => p === playerName)) {
      setSelectedPlayers(selectedPlayers.filter((p) => p !== playerName));
    } else {
      setSelectedPlayers([...selectedPlayers, playerName]);
    }
  };
  return (
    <div>
      <div className="buttons is-flex">
        {selectedPlayers.map((u) => (
          <button
            className="button px-2 is-primary is-inverted"
            key={u}
            onClick={() => togglePlayer(u)}
          >
            {u}
          </button>
        ))}
      </div>
      <hr />
      <div className="is-flex">
        <div className="buttons is-flex">
          {friends &&
            friends
              .filter((p) => !selectedPlayers.some((s) => s === p))
              .map((u) => (
                <button
                  className="button px-2 is-primary"
                  key={u}
                  onClick={() => togglePlayer(u)}
                >
                  {u}
                </button>
              ))}
          {friends &&
            friends
              .filter((p) => !selectedPlayers.some((s) => s === p))
              .map((u) => (
                <button
                  className="button px-2 is-primary"
                  key={u}
                  onClick={() => togglePlayer(u)}
                >
                  {u}
                </button>
              ))}
          {friends &&
            friends
              .filter((p) => !selectedPlayers.some((s) => s === p))
              .map((u) => (
                <button
                  className="button px-2 is-primary"
                  key={u}
                  onClick={() => togglePlayer(u)}
                >
                  {u}
                </button>
              ))}
          {friends &&
            friends
              .filter((p) => !selectedPlayers.some((s) => s === p))
              .map((u) => (
                <button
                  className="button px-2 is-primary"
                  key={u}
                  onClick={() => togglePlayer(u)}
                >
                  {u}
                </button>
              ))}
          {friends &&
            friends
              .filter((p) => !selectedPlayers.some((s) => s === p))
              .map((u) => (
                <button
                  className="button px-2 is-primary"
                  key={u}
                  onClick={() => togglePlayer(u)}
                >
                  {u}
                </button>
              ))}
        </div>
        <div className="is-flex">
          <AddFriends />
        </div>
      </div>
      {/* <div className="field is-grouped">
        <div className="control  is-expanded">
          <div className="select is-fullwidth">
            <select
              onChange={(e) => playerAdded(e.target.value)}
              style={{ backgroundColor: colors.field }}
            >
              <option></option>
              {friends?.map((u) => (
                <option key={u}>{u}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="control">
          <AddFriends />
        </div>
      </div>
      {selectedPlayers.map((p) => (
        <span onClick={() => removePlayer(p)} key={p} className="tag is-black">
          {p}
          <button className="delete is-small"></button>
        </span>
      ))} */}
    </div>
  );
};

export default connector(PlayersSelector);
