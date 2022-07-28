import React from "react";
import { Provider } from "react-redux";
import AuthIsLoaded from "./AuthServiceProvider";
import { SnackbarProvider } from "notistack";
import { ErrorBoundary } from "react-error-boundary";
import MasterRouter from "@src/routes/MasterRouter";
import ErrorFallback from "@components/ErrorFallback";
import { persistor, store } from "@store/configureStore";
import { PersistGate } from "redux-persist/integration/react";
import { Backdrop, CircularProgress } from "@material-ui/core";
import AppServiceProvider from "@providers/AppServiceProvider";


const App = () => {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // reset the state of your app so the error doesn't happen again
      }}
    >
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AppServiceProvider>
            <SnackbarProvider
              maxSnack={3}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
            >
              <React.Suspense
                fallback={
                  <Backdrop open>
                    <CircularProgress color="inherit" />
                  </Backdrop>
                }
              >
                <AuthIsLoaded>
                  <MasterRouter />
                </AuthIsLoaded>
              </React.Suspense>
            </SnackbarProvider>
          </AppServiceProvider>
        </PersistGate>
      </Provider>
    </ErrorBoundary>
  );
};

export default App;
