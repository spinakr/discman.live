import { Action, Reducer } from "redux";
import { AppThunkAction } from ".";
import { CallHistoryMethodAction } from "connected-react-router";

export type Severity = "info" | "warning" | "error";

export interface Notification {
  id: number;
  message: string;
  severity: Severity;
}

export interface NotificationState {
  notifications: Notification[];
}

export interface AddNotificationAction {
  type: "ADD_NOTIFICATION";
  notification: Notification;
}

export interface ExpireNotificationAction {
  type: "EXPIRE_NOTIFICATION";
  notificationId: number;
}

export type KnownAction =
  | CallHistoryMethodAction
  | ExpireNotificationAction
  | AddNotificationAction;

const initialState: NotificationState = {
  notifications: [],
};

export const actionCreators = {
  hideNotification: (id: number): AppThunkAction<KnownAction> => (
    dispatch,
    getState
  ) => {
    dispatch({
      type: "EXPIRE_NOTIFICATION",
      notificationId: id,
    });
  },
  showNotification: (message: string, severity: Severity, dispatch: any) => {
    const notificationId = Math.floor(Math.random() * 100);
    dispatch({
      type: "ADD_NOTIFICATION",
      notification: { id: notificationId, message, severity },
    });

    setTimeout(() => {
      dispatch({
        type: "EXPIRE_NOTIFICATION",
        notificationId: notificationId,
      });
    }, 3000);
  },
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

export const reducer: Reducer<NotificationState> = (
  state: NotificationState | undefined,
  incomingAction: Action
): NotificationState => {
  if (state === undefined) {
    return initialState;
  }

  const action = incomingAction as KnownAction;
  switch (action.type) {
    case "ADD_NOTIFICATION":
      return {
        ...state,
        notifications: [...state.notifications, action.notification],
      };
    case "EXPIRE_NOTIFICATION":
      return {
        ...state,
        notifications: [
          ...state.notifications.filter((n) => n.id !== action.notificationId),
        ],
      };
    default:
      return state;
  }
};
