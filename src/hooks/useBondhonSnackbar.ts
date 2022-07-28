import React from "react";
import { useAppDispatch } from "./store";
import { notistackSlice } from "@store/slices/notistackSlice";
import { OptionsObject, SnackbarKey, SnackbarMessage } from "notistack";

const useBondhonSnackbar = () => {
  const dispatch = useAppDispatch();
  const enqueueSnackbar = React.useCallback(
    (
      ...args: [
        {
          message: SnackbarMessage;
          options?: OptionsObject;
        }
      ]
    ) => dispatch(notistackSlice.actions.enquerSnackbar(...args)),
    [dispatch]
  );

  const closeSnackbar = (key?: SnackbarKey) =>
    dispatch(notistackSlice.actions.closeSnackbar(key));

  const enqueueErrorSnackbar = React.useCallback(
    (message: SnackbarMessage, options: OptionsObject = {}) =>
      enqueueSnackbar({
        message,
        options: {
          variant: "error",
          ...options,
        },
      }),
    [enqueueSnackbar]
  );

  const enqueueSuccessSnackbar = React.useCallback(
    (message: SnackbarMessage, options: OptionsObject = {}) =>
      enqueueSnackbar({
        message,
        options: {
          variant: "success",
          ...options,
        },
      }),
    [enqueueSnackbar]
  );

  const enqueueInfoSnackbar = React.useCallback(
    (message: SnackbarMessage, options: OptionsObject = {}) =>
      enqueueSnackbar({
        message,
        options: {
          variant: "info",
          ...options,
        },
      }),
    [enqueueSnackbar]
  );

  return {
    closeSnackbar,
    enqueueSnackbar,
    enqueueInfoSnackbar,
    enqueueErrorSnackbar,
    enqueueSuccessSnackbar,
  };
};

export default useBondhonSnackbar;
