import React from "react";
import { SnackbarKey, useSnackbar } from "notistack";
import { notistackSlice } from "@store/slices/notistackSlice";
import { useAppDispatch, useAppSelector } from "@hooks/store";

let displayed: SnackbarKey[] = [];

const Notifier = () => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(
    (store) => store.notistack.notifications || []
  );
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const storeDisplayed = (id: SnackbarKey) => {
    displayed = [...displayed, id];
  };

  const removeDisplayed = (id: SnackbarKey) => {
    displayed = [...displayed.filter((key) => id !== key)];
  };

  React.useEffect(() => {
    notifications.forEach(({ key, message, options = {}, dismissed }) => {
      if (dismissed) {
        // dismiss snackbar using notistack
        closeSnackbar(key);
        return;
      }

      // do nothing if snackbar is already displayed
      if (displayed.includes(key)) return;

      // display snackbar using notistack
      enqueueSnackbar(message, {
        key,
        ...options,
        onClose: (event, reason, myKey) => {
          if (options.onClose) {
            options.onClose(event, reason, myKey);
          }
        },
        onExited: (event, myKey) => {
          // remove this snackbar from redux store
          dispatch(notistackSlice.actions.removeSnackbar(myKey));
          removeDisplayed(myKey);
        },
      });
      // keep track of snackbars that we've displayed
      storeDisplayed(key);
    });
  }, [notifications, closeSnackbar, enqueueSnackbar, dispatch]);

  return null;
};

export default Notifier;
