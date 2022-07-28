import { api } from "@data/laravel/services/api";
import storage from "redux-persist/lib/storage";
import rootReducer from "./reducers/rootReducer";
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { notistackSlice } from "./slices/notistackSlice";
import { rtkQueryErrorLogger } from "./middleware/rtkQueryErrorLogger";
import {
  FLUSH,
  PURGE,
  PAUSE,
  PERSIST,
  REGISTER,
  REHYDRATE,
  persistStore,
  persistReducer,
} from "redux-persist";

const persistConfig = {
  storage,
  key: "root",
  version: 1,
  whitelist: ["auth"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export function createStore(
  preloadedState: Partial<ReturnType<typeof rootReducer>> = {}
) {
  const store = configureStore({
    reducer: persistedReducer,
    preloadedState: preloadedState as any,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        immutableCheck: {
          ignoredPaths: ["firebase", "firestore"],
        },
        serializableCheck: {
          ignoredActions: [
            FLUSH,
            REHYDRATE,
            PAUSE,
            PERSIST,
            PURGE,
            REGISTER,
            notistackSlice.actions.enquerSnackbar.type,
            notistackSlice.actions.closeSnackbar.type,
            notistackSlice.actions.removeSnackbar.type,
          ],
          ignoredPaths: [],
        },
        thunk: {
          extraArgument: {},
        },
      }).concat(api.middleware, rtkQueryErrorLogger),
  });

  return store;
}

export const store = createStore();

export const persistor = persistStore(store);

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch);
