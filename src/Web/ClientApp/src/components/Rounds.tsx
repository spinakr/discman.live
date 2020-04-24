import React, { useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { ApplicationState } from "../store";
import * as LoginStore from "../store/Login";

const mapState = (state: ApplicationState) => state.login;

const connector = connect(mapState, LoginStore.actionCreators);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {};

const Rounds = (props: Props) => (
  <ul>
    <li>round1</li>
    <li>round1</li>
    <li>round1</li>
  </ul>
);

export default connector(Rounds);
