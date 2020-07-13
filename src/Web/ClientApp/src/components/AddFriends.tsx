/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { ApplicationState } from "../store";
import { actionCreators as coursesActionCreator } from "../store/Courses";
import { actionCreators as loginActionCreator } from "../store/User";
import { actionCreators as roundsActionCreator } from "../store/Rounds";
import { actionCreators as userActionCreator } from "../store/User";

const mapState = (state: ApplicationState) => {
  return {
    courses: state.courses?.courses,
    friends: state.user?.friendUsers,
    username: state.user?.user?.username || "",
    searchedUsers: state.user?.searchedUsers || [],
  };
};

const connector = connect(mapState, {
  ...coursesActionCreator,
  ...loginActionCreator,
  ...roundsActionCreator,
  ...userActionCreator,
});

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {};

const AddFriends = (props: Props) => {
  const [searchString, setSearchString] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const searchStringChanged = (newSearchString: string) => {
    setSearchString(newSearchString);
    props.searchUsers(newSearchString);
  };
  return (
    <>
      <div className={showDialog ? "modal is-active" : "modal"}>
        <div
          onClick={() => {
            setShowDialog(false);
            searchStringChanged("");
          }}
        >
          <div className="modal-background"></div>
        </div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Add Friends</p>
          </header>
          <section className="modal-card-body">
            <div className="field has-addons">
              <div className="control ">
                <input
                  className="input is-expanded"
                  value={searchString}
                  onChange={(e) => searchStringChanged(e.target.value)}
                  type="text"
                  placeholder="Username"
                />
              </div>
            </div>
            <div>
              {props.searchedUsers.map((s) => (
                <div className="field has-addons" key={s}>
                  <div className="control">
                    <input
                      className="input is-small"
                      type="text"
                      value={s}
                      onChange={() => {}}
                    />
                  </div>
                  <div className="control">
                    <a
                      className="button is-info is-primary is-small"
                      onClick={() => {
                        props.addFriend(s);
                        searchStringChanged("");
                      }}
                    >
                      Add
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
          <footer className="modal-card-foot">
            <button className="button" onClick={() => setShowDialog(false)}>
              Done
            </button>
          </footer>
        </div>
      </div>
      <button
        className="button is-information"
        onClick={() => setShowDialog(true)}
      >
        <strong>Add Friends</strong>
      </button>
    </>
  );
};

export default connector(AddFriends);
