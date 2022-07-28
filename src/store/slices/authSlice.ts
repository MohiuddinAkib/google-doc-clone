// import { api } from "@data/laravel/services/api";
import { api } from "@data/laravel/services/api";
import type { RootState, User } from "@src/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loggedOut, tokenReceived } from "@store/actions/auth";

type AuthState = {
  user: User | null;
  token: string | null;
};

const slice = createSlice({
  name: "auth",
  initialState: { user: null, token: null } as AuthState,
  reducers: {
    setCredentials: (
      state,
      { payload: { user, token } }: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = user;
      state.token = token;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(tokenReceived, (state, action) => {
      state.token = action.payload;
    });

    builder.addCase(loggedOut, (state, action) => {
      state.token = null;
    });

    builder.addMatcher(
      api.endpoints.login.matchFulfilled,
      (state, { payload }) => {
        state.token = payload.token;
        state.user = payload.user;
      }
    );

    builder.addMatcher(
      api.endpoints.googleLogin.matchFulfilled,
      (state, { payload }) => {
        state.token = payload.token;
        state.user = payload.user;
      }
    );
  },
});

export const { setCredentials } = slice.actions;

export default slice.reducer;

export const selectIsAuthenticated = (state: RootState) => !!state.auth.token;
