import { OptionsObject, SnackbarKey, SnackbarMessage } from "notistack";
import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";

interface INotification {
  key: SnackbarKey;
  dismissed: boolean;
  options?: OptionsObject;
  message: SnackbarMessage;
}

const initialState: {
  notifications: INotification[];
} = {
  notifications: [],
};

export const notistackSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    enquerSnackbar: {
      reducer(state, { payload }: PayloadAction<INotification>) {
        state.notifications.push(payload as any);
      },
      prepare(notification: Omit<INotification, "key" | "dismissed">) {
        const payload = {
          ...notification,
          dismissed: false,
          key: nanoid(),
        };
        return { payload };
      },
    },
    closeSnackbar: {
      reducer: (
        state,
        action: PayloadAction<{ dismissAll: boolean; key: SnackbarKey }>
      ) => {
        const { payload } = action;
        state.notifications = state.notifications.map((notification) => {
          const shouldDismiss =
            payload.dismissAll || notification.key === payload.key;
          return shouldDismiss
            ? { ...notification, dismissed: true }
            : { ...notification };
        });
      },
      prepare: (key: SnackbarKey = "") => ({
        payload: { key, dismissAll: !key },
      }),
    },
    removeSnackbar(state, { payload }) {
      state.notifications = state.notifications.filter(
        (notification) => notification.key !== payload
      );
    },
  },
  extraReducers: (builder) => {},
});
