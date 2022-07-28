import makeTheme from "./themeFactory";
import { darken, lighten } from "@material-ui/core/styles";

const primaryColor = "#DB5A3B";
const secondaryColor = "#D5D9E6";
const successColor = "#33AC2E";
const errorColor = "#D63649";
const warningColor = "#F7C137";

const darkPrimaryColor = "#FFFFFF";
const darkSecondaryColor = "#1A1D35";
const darkBackgroundColor = "#050718";
const darkPaperColor = "#121424";

const darkTheme = makeTheme({
  overrides: {
    MuiCssBaseline: {
      "@global": {},
    },
    MuiListItem: {
      root: {
        "&$selected": {
          borderLeft: `3px solid ${darkPrimaryColor}`,
        },
      },
    },
  },
  palette: {
    type: "dark",
    secondary: {
      main: darkSecondaryColor,
    },
    primary: {
      main: darkPrimaryColor,
    },
    background: {
      default: darkBackgroundColor,
      paper: darkPaperColor,
    },
    action: {
      selected: darkSecondaryColor,
    },
    warning: {
      main: warningColor,
      contrastText: "#FFFFFF",
      light: lighten(warningColor, 0.2),
      dark: darken(warningColor, 0.2),
    },
    error: {
      main: errorColor,
      contrastText: "#FFFFFF",
      light: lighten(errorColor, 0.2),
      dark: darken(errorColor, 0.2),
    },
    success: {
      main: successColor,
      contrastText: "#FFFFFF",
      light: lighten(successColor, 0.2),
      dark: darken(successColor, 0.2),
    },
    text: {
      primary: "#2E384D",
      secondary: "#B0BAC9",
      hint: "#8798AD",
    },
  },
});

const lightTheme = makeTheme({
  overrides: {
    MuiCssBaseline: {
      "@global": {
        /* width */
        "::-webkit-scrollbar": {
          width: 7,
        },
        /* Track */
        "::-webkit-scrollbar-track": {
          background: secondaryColor,
        },
        /* Handle */
        "::-webkit-scrollbar-thumb": {
          borderRadius: 21,
          background: primaryColor,
        },
      },
    },
  },
});

export const createAppTheme = (darkMode: boolean) => {
  return darkMode ? darkTheme : lightTheme;
};
