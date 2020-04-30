import React, { useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import * as RoundsStore from "../store/Rounds";

const connector = connect(null, RoundsStore.actionCreators);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {};

const onFocus = (refreshRound: () => void) => () => {
  refreshRound();
};

const onBlur = (dissconnectHub: () => void) => () => {
  console.log("unload");
};

const WindowFocusHandler = (props: Props) => {
  useEffect(() => {
    window.addEventListener("focus", onFocus(props.refreshRound));
    window.addEventListener("beforeunload", onBlur(props.dissconnectHub));
    return () => {
      window.removeEventListener("focus", onFocus(props.refreshRound));
      window.removeEventListener("beforeunload", onBlur(props.dissconnectHub));
    };
  });

  return <></>;
};

export default connector(WindowFocusHandler);
