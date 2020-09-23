import * as React from "react";
import { Route } from "react-router";
import Layout from "./components/Layout";
import Home from "./components/Home";
import Round from "./components/Round/Round";
import Courses from "./components/Courses/Courses";
import User from "./components/User/User";
import Friends from "./components/User/Friends";
import Tournament from "./components/Tournaments/Tournament";
import Leaders from "./components/Leaders";
import Tournaments from "./components/Tournaments/Tournaments";
import UserSettings from "./components/User/UserSettings";
import ResetPassword from "./components/User/ResetPassword";
import About from "./components/About";
import { ApplicationState } from "./store";
import { actionCreators as usersActionCreators } from "./store/User";
import { connect, ConnectedProps } from "react-redux";
import NewsMessages from "./components/NewsMessages";

export interface AppCompProps {
  token: string | undefined;
}
export interface AppCompState {
  hasError: boolean;
  detailsFetched: Date | null;
}

const mapState = (state: ApplicationState) => {
  return {
    loggedIn: state.user?.loggedIn,
  };
};

const connector = connect(mapState, usersActionCreators);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & AppCompProps;

const onFocus = (
  refreshUserDetails: (onlyIfDisconnected: boolean) => void,
  connectToHub: () => void
) => () => {
  refreshUserDetails(true);
  connectToHub();
};

export class App extends React.PureComponent<Props, AppCompState> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, detailsFetched: null };
  }

  componentDidMount() {
    if (this.props.loggedIn) {
      this.props.fetchUserDetails();
    }
    window.addEventListener(
      "focus",
      onFocus(this.props.fetchUserDetails, this.props.connectToHub)
    );
  }

  componentWillUnmount() {
    window.removeEventListener(
      "focus",
      onFocus(this.props.fetchUserDetails, this.props.connectToHub)
    );
  }

  componentDidUpdate() {
    if (this.props.loggedIn) {
      this.props.fetchUserDetails();
    }
  }

  componentDidCatch(error: any, errorInfo: any) {
    if (this.props.token) {
      fetch(`api/logger/render`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.props.token}`,
        },
        body: JSON.stringify({
          exception: error,
          info: JSON.stringify(errorInfo),
        }),
      });
    }
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return <div>Error</div>;
    }
    return (
      <>
        <Layout>
          <Route exact path="/" component={Home} />
          <Route exact path="/rounds/:roundId" component={Round} />
          <Route
            exact
            path="/courses/:courseName?/:courseLayout?"
            component={Courses}
          />
          <Route exact path="/user" component={User} />
          <Route exact path="/settings" component={UserSettings} />
          <Route exact path="/leaders" component={Leaders} />
          <Route exact path="/users/:username" component={User} />
          <Route exact path="/friends" component={Friends} />
          <Route
            exact
            path="/tournaments/:tournamentId"
            component={Tournament}
          />
          <Route exact path="/tournaments" component={Tournaments} />
          <Route exact path="/about" component={About} />
          <Route exact path="/resetpassword" component={ResetPassword} />
        </Layout>
      </>
    );
  }
}
export default connector(App);
