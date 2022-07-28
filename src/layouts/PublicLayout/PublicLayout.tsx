import React from "react";
import { CssBaseline } from "@material-ui/core";
import styled, { ThemeProvider } from "styled-components";
import { StylesProvider, useTheme } from "@material-ui/core/styles";
import { getDefaultScheme, getFullscreen, Root } from "@mui-treasury/layout";

const scheme = getDefaultScheme();
const Fullscreen = getFullscreen(styled);

const PublicLayout: React.FC = (props) => {
  const theme = useTheme();

  return (
    <Fullscreen>
      <Root theme={theme} scheme={scheme}>
        <StylesProvider injectFirst>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {props.children}
          </ThemeProvider>
        </StylesProvider>
      </Root>
    </Fullscreen>
  );
};

export default PublicLayout;
