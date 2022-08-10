import React, { useEffect, useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { ApplicationState } from "../../store";
import * as UserStore from "../../store/User";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Label,
} from "recharts";
import moment from "moment";

const mapState = (state: ApplicationState) => {
  return {
    usersDetails: state.user?.usersDetails,
  };
};

const connector = connect(mapState, UserStore.actionCreators);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & { username?: string };

const RatingHistoryComponent = (props: Props) => {
  if (!props.usersDetails) return null;

  const userDetails =
    props.usersDetails &&
    props.usersDetails.find((d) => d.username === props.username);
  return (
    <>
      <div>
        <LineChart width={380} height={300} data={userDetails?.ratingHistory}>
          <Line type="monotone" dataKey="elo" stroke="#8884d8" dot={false} />
          <XAxis
            dataKey="dateTime"
            tick={{ fontSize: 10, fill: "black" }}
            tickFormatter={(time) => moment(time).format("DD.MM")}
          ></XAxis>
          <YAxis
            domain={["dataMin - 10", "auto"]}
            tick={{ fontSize: 10, fill: "black" }}
            mirror
            padding={{ bottom: 20 }}
          />
        </LineChart>
      </div>
    </>
  );
};

export default connector(RatingHistoryComponent);
