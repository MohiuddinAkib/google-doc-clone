import React from "react";
import { Theme } from "@material-ui/core";
import DateFnsUtils from "@date-io/dayjs";
import { SnackbarProvider } from "notistack";
import Notifier from "@components/ui/Notifier";
import { HelmetProvider } from "react-helmet-async";
import { ConfirmProvider } from 'material-ui-confirm';
import { ReactQueryDevtools } from "react-query/devtools";
import { createAppTheme } from "@src/theme/appThemeFactory";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { ThemeProvider as MUIThemeProvider } from "@material-ui/styles";
import { QueryCache, QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient({
  queryCache: new QueryCache(),
});

export const AppServiceContext = React.createContext({
  darkMode: false,
  theme: {} as Theme,
  toggleDarkMode: () => { },
});

const AppServiceProvider: React.FC = (props) => {
  const [darkMode, setDarkMode] = React.useState(false);

  const theme = React.useMemo(() => {
    return createAppTheme(darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prevState) => !prevState);
  };

  return (
    <AppServiceContext.Provider
      value={{
        theme,
        darkMode,
        toggleDarkMode,
      }}
    >
      <ConfirmProvider>
        <QueryClientProvider client={queryClient}>
          <HelmetProvider>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <MUIThemeProvider theme={theme}>
                <SnackbarProvider
                  maxSnack={3}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                  }}
                >
                  {props.children}
                  <Notifier />
                </SnackbarProvider>
              </MUIThemeProvider>
            </MuiPickersUtilsProvider>
          </HelmetProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </ConfirmProvider>
    </AppServiceContext.Provider>
  );
};

export default AppServiceProvider;
