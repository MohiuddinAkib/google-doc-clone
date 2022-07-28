import React from "react";
import styled from "styled-components";
import {
  sizing,
  borders,
  spacing,
  compose,
  palette,
  flexbox,
  typography,
  SizingProps,
  BordersProps,
  SpacingProps,
  PaletteProps,
  FlexboxProps,
  TypographyProps,
} from "@material-ui/system";
import {
  Chip,
  Grid,
  Button,
  Avatar,
  ChipProps,
  GridProps,
  Typography,
  IconButton,
  AvatarProps,
  CircularProgress,
  CircularProgressProps,
  TypographyProps as MuiTypographyProps,
} from "@material-ui/core";

export const StyledGrid = styled(Grid)<
  GridProps & SizingProps & SpacingProps & FlexboxProps & PaletteProps
>`
  ${compose(sizing, spacing, flexbox, palette)}
`;

export const StyledIconButton = styled(IconButton)<
  React.ComponentProps<typeof Button> &
    BordersProps &
    SpacingProps &
    PaletteProps
>`
  ${compose(borders, spacing, palette)}
`;

export const StyledButton = styled(Button)<
  React.ComponentProps<typeof Button> &
    BordersProps &
    SpacingProps &
    PaletteProps
>`
  ${compose(borders, spacing, palette)}
`;

export const StyledChip = styled(Chip)<ChipProps & BordersProps & PaletteProps>`
  ${compose(borders, palette)}
`;

export const StyledAvatar = styled(Avatar)<
  AvatarProps & BordersProps & SizingProps & SpacingProps & PaletteProps
>`
  ${compose(borders, spacing, sizing, palette)}
`;

export const StyledTypography = styled(Typography)<
  MuiTypographyProps & TypographyProps & SpacingProps & PaletteProps
>`
  ${compose(typography, spacing, palette)}
`;

export const StyledCircularProgress = styled(CircularProgress)<
  CircularProgressProps & SpacingProps
>`
  ${compose(spacing)}
`;
