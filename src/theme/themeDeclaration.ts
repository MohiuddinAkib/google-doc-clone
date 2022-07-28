import { Breakpoint } from "@material-ui/core/styles/createBreakpoints";

declare module "@material-ui/core/styles/createTheme" {
  interface Theme {
    appDrawer: {
      width: React.CSSProperties["width"];
      breakpoint: Breakpoint;
    };
  }

  // allow configuration using `createTheme`
  interface ThemeOptions {
    appDrawer?: {
      width?: React.CSSProperties["width"];
      breakpoint?: Breakpoint;
    };
  }
}

declare module "@material-ui/core/styles/createPalette" {
  interface Palette {}

  interface PaletteOptions {}
}
