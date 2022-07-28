import _ from "lodash";
import "@fontsource/mulish";
import "@fontsource/mulish/200.css";
import "@fontsource/mulish/300.css";
import "@fontsource/mulish/400.css";
import "@fontsource/mulish/500.css";
import "@fontsource/mulish/600.css";
import "@fontsource/mulish/700.css";
import "@fontsource/mulish/800.css";
import "@fontsource/mulish/900.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "@fontsource/poppins";

import {
  createTheme,
  ThemeOptions,
  responsiveFontSizes,
} from "@material-ui/core/styles";

export default function makeTheme(options: ThemeOptions) {
  return responsiveFontSizes(
    createTheme(
      _.merge(options, {
        appDrawer: {
          width: 225,
          breakpoint: "lg",
        },
        mixins: {},
        overrides: {
          MuiListItemIcon: {},
          MuiPaper: {},
        },
        props: {
          MuiListItemIcon: {},
          MuiMenu: {},
        },
        typography: {
          fontFamily: [
            "Mulish",
            "Poppins",
            "Roboto",
            "BlinkMacSystemFont",
            "'Segoe UI'",
            "'Helvetica Neue'",
            "Arial",
            "sans-serif",
            "'Apple Color Emoji'",
            "'Segoe UI Emoji'",
            "'Segoe UI Symbol'",
          ].join(","),
          // h1: {
          //   fontSize: 48,
          //   fontWeight: 300,
          // },
          // h2: {
          //   fontSize: 34,
          //   fontWeight: 300,
          // },
          // h3: {
          //   fontSize: 28,
          //   fontWeight: 300,
          // },
          // h4: {
          //   fontSize: 18,
          //   fontWeight: 600,
          // },
          // h5: {
          //   fontSize: 15,
          //   fontWeight: 500,
          // },
          // caption: {
          //   fontSize: 12,
          //   fontWeight: 500,
          // },
          // overline: {
          //   fontSize: 13,
          //   fontWeight: 400,
          // },
          // body1: {
          //   fontSize: 15,
          //   fontWeight: 400,
          // },
        },
      })
    )
  );
}
