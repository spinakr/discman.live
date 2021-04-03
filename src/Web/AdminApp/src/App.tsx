import * as React from "react";
import { Route } from "react-router";
import Layout from "./components/Layout";
import Home from "./components/Home";
import { ApplicationState } from "./store";
import { actionCreators as usersActionCreators } from "./store/User";
import { connect, ConnectedProps } from "react-redux";
import queryString from "query-string";

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
    location: state.router.location,
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
    const query = queryString.parse(this.props.location.search);
    const userToken = query.token as string;
    if (userToken) this.props.setLoggedInUser(decodeURI(userToken));
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
          </Layout>
      </>
    );
  }
}
export default connector(App);
