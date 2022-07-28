import {
  Middleware,
  MiddlewareAPI,
  isRejectedWithValue,
} from "@reduxjs/toolkit";
import { notistackSlice } from "@store/slices/notistackSlice";

/**
 * Log a warning and show a toast!
 */
export const rtkQueryErrorLogger: Middleware =
  (api: MiddlewareAPI) => (next) => (action) => {
    // RTK Query uses `createAsyncThunk` from redux-toolkit under the hood, so we're able to utilize these matchers!
    if (isRejectedWithValue(action)) {
      console.warn("We got a rejected action!", action);
      const non_field_error = action.payload.data.non_field_error;

      if (!!non_field_error) {
        api.dispatch(
          notistackSlice.actions.enquerSnackbar({
            message: action.payload.data.non_field_error,
            options: {
              variant: "error",
            },
          })
        );
      }
    }

    return next(action);
  };
