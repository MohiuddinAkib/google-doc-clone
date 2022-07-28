import React from "react";
import { User } from "firebase/auth";
import useAgora from "@hooks/useAgora";
import { Link } from "react-router-dom";
import MediaPlayer from "./MediaPlayer";
import useApp from "@hooks/useAppContext";
import { nanoid } from "@reduxjs/toolkit";
import { Helmet } from "react-helmet-async";
import { createClient } from "agora-rtc-react";
import { AvatarGroup } from '@material-ui/lab';
import { State } from "@mui-treasury/layout/types";
import { CopyToClipboard } from "react-copy-to-clipboard";
import styled, { ThemeProvider } from "styled-components";
import { usePopupState } from "material-ui-popup-state/hooks";
import { bindMenu, bindTrigger } from "material-ui-popup-state";
import { StylesProvider, useTheme, } from "@material-ui/core/styles";
import { useFetchAgoraTokenMutation, useLogoutMutation } from "@data/laravel/services/api";
import Layout, {
  Root,
  getHeader,
  getContent,
  getDrawerSidebar,
  getInsetContainer,
  getSidebarContent,
} from "@mui-treasury/layout";
import {
  Box,
  Fade,
  Menu,
  Switch,
  Avatar,
  Button,
  Toolbar,
  MenuItem,
  TextField,
  IconButton,
  CssBaseline,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Typography,
} from "@material-ui/core";
import {
  Mic,
  Add,
  MicOff,
  CallEnd,
  Keyboard,
  Videocam,
  ArrowBack,
  VideocamOff,
  Settings as SettingsIcon,
  ExitToApp as ExitToAppIcon,
  Brightness5 as Brightness5Icon,
  Brightness7 as Brightness7Icon,
  FileCopy,
  GetApp,
} from "@material-ui/icons";

const Header = getHeader(styled);
const Content = getContent(styled);
const DrawerSidebar = getDrawerSidebar(styled);
const SidebarContent = getSidebarContent(styled);
const InsetContainer = getInsetContainer(styled);

const scheme = Layout();

const useClient = createClient({ mode: "rtc", codec: "h264" });


function DocumentWriteLayout({ children, activeUsers = [], documentTitle = "", onDownLoad }: React.PropsWithChildren<{ onDownLoad?: () => void; activeUsers: Array<User>; documentTitle?: string }>) {
  const app = useApp();
  const theme = useTheme();
  const client = useClient();
  const [channelName, setChannelName] = React.useState("");
  const [showChannelForm, setShowChannelForm] = React.useState(false);

  console.log("users are", activeUsers)

  const {
    localAudioTrack, localVideoTrack, leave, join, joinState, remoteUsers, trackState, mute
  } = useAgora(client);

  console.log("remote users", remoteUsers)

  // React.useEffect(() => {
  //   localAudioTrack?.play()
  // }, [localAudioTrack])

  const [logout] = useLogoutMutation()
  const [fetchAgoraToken, { isLoading: isFetchingAgoraToken }] = useFetchAgoraTokenMutation()

  const [layoutState,] = React.useState<State>({
    sidebar: {
      right_sidebar: {
        open: true,
        collapsed: false,
      },
    },
  });

  const accountMenuPopupState = usePopupState({
    variant: "popover",
    popupId: "primary-search-account-menu",
  });

  const callMenuPopupState = usePopupState({
    variant: "popover",
    popupId: "call-menu",
  });

  scheme.configureHeader((builder) => {
    builder
      .registerConfig("xs", {
        position: "relative",
        initialHeight: 64,
      })
  });

  scheme.configureEdgeSidebar((builder) => {
    builder
      .create("right_sidebar", { anchor: "right" })
      .registerTemporaryConfig("xs", {
        anchor: "right",
        width: 240,
      } as any)
      .registerPersistentConfig("lg", {
        width: 270,
        collapsible: true,
        autoExpanded: true,
        persistentBehavior: "fit",
      });
  });

  const joinCall = () => {
    fetchAgoraToken({
      channelName
    })
      .unwrap()
      .then((result) => {
        join(channelName, result.token)
        setShowChannelForm(false)
        callMenuPopupState.close()
      })
  }

  const startCall = () => {
    const newChannelName = nanoid();
    setChannelName(newChannelName)

    fetchAgoraToken({
      channelName: newChannelName
    })
      .unwrap()
      .then((result) => {
        join(newChannelName, result.token)
        callMenuPopupState.close()
      })
  }

  const handleLogout = () => {
    logout()
  };

  return (
    <Root scheme={scheme} initialState={layoutState} theme={theme}>
      {(layoutProps) => {
        return (
          <StylesProvider injectFirst>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <Box
                display={"flex"}
                minHeight={"100vh"}
                flexDirection={"column"}
              >
                <Helmet>
                  <title>{"Sakila Admin"}</title>
                </Helmet>


                <Header
                  elevation={0}
                  position={"fixed"}
                >
                  <Toolbar >
                    <Box mx={1}>
                      <IconButton color={"primary"} size={"small"} onClick={onDownLoad}>
                        <GetApp />
                      </IconButton>
                    </Box>


                    <Typography variant={"h6"} style={{ fontWeight: "bold" }}>
                      {documentTitle}
                    </Typography>

                    <Box flex={1} pl={3}></Box>

                    <Box mr={3}>
                      <AvatarGroup max={4}>
                        {activeUsers.map(activeUser => (
                          <Avatar key={activeUser.uid} alt={activeUser.uid} src={activeUser.photoURL ?? ""} />
                        ))}
                      </AvatarGroup>
                    </Box>

                    <Box mr={3}>
                      <IconButton edge={"end"}
                        size={"small"}
                        {...bindTrigger(callMenuPopupState)}
                        disabled={isFetchingAgoraToken || joinState}>
                        <Videocam />
                      </IconButton>
                      {/* <SidebarTrigger sidebarId={"right_sidebar"} /> */}
                    </Box>

                    <IconButton
                      edge={"end"}
                      size={"small"}
                      {...bindTrigger(accountMenuPopupState)}
                    >
                      <Avatar />
                    </IconButton>
                  </Toolbar>
                </Header>

                {/* Profile Menu */}
                <Menu
                  {...bindMenu(callMenuPopupState)}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                  PaperProps={{
                    square: true,
                  }}
                  variant={"selectedMenu"}
                  TransitionComponent={Fade}
                >
                  {showChannelForm ? <div>
                    <IconButton onClick={() => setShowChannelForm(false)}>
                      <ArrowBack />
                    </IconButton>
                    <TextField size={"small"} variant={"outlined"} onChange={e => setChannelName(e.target.value)} />
                    <Button disabled={!channelName} onClick={joinCall}>Continue</Button>
                  </div> : <div>
                    <MenuItem button onClick={startCall}>
                      <ListItemIcon>
                        <Add />
                      </ListItemIcon>
                      <ListItemText
                        primary={"Create call"}
                        primaryTypographyProps={{
                          color: "textSecondary",
                        }}
                      />
                    </MenuItem>

                    <MenuItem button onClick={() => setShowChannelForm(true)}>
                      <ListItemIcon>
                        <Keyboard />
                      </ListItemIcon>
                      <ListItemText
                        primary={"Join call"}
                        primaryTypographyProps={{
                          color: "textSecondary",
                        }}
                      />
                    </MenuItem>
                  </div>}

                </Menu>


                {/* Profile Menu */}
                <Menu
                  {...bindMenu(accountMenuPopupState)}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                  PaperProps={{
                    square: true,
                  }}
                  variant={"selectedMenu"}
                  TransitionComponent={Fade}
                >
                  <MenuItem>
                    <ListItemIcon>
                      <Brightness5Icon />
                    </ListItemIcon>
                    <Switch
                      color={"primary"}
                      checked={app.darkMode}
                      onChange={app.toggleDarkMode}
                    />
                    <ListItemSecondaryAction>
                      <Brightness7Icon />
                    </ListItemSecondaryAction>
                  </MenuItem>

                  <MenuItem button component={Link} to={"/settings"}>
                    <ListItemIcon>
                      <SettingsIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={"Settings"}
                      primaryTypographyProps={{
                        color: "textSecondary",
                      }}
                    />
                  </MenuItem>

                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <ExitToAppIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={"Logout"}
                      primaryTypographyProps={{
                        color: "textSecondary",
                      }}
                    />
                  </MenuItem>
                </Menu>

                <DrawerSidebar
                  elevation={0}
                  sidebarId={"right_sidebar"}
                >
                  <SidebarContent>
                    <div>
                      <div id="videos">
                        {joinState && localVideoTrack && <MediaPlayer videoTrack={localVideoTrack} audioTrack={undefined}></MediaPlayer>}
                        {remoteUsers.map(user => (<div className='remote-player-wrapper' key={user.uid}>
                          <p className='remote-player-text'>{`remoteVideo(${user.uid})`}</p>
                          <MediaPlayer videoTrack={user.videoTrack} audioTrack={user.audioTrack}></MediaPlayer>
                        </div>))}
                      </div>
                    </div>
                  </SidebarContent>

                  {!!channelName && <Box>
                    <CopyToClipboard text={channelName}>
                      <Button fullWidth endIcon={<FileCopy />}>{channelName}</Button>
                    </CopyToClipboard>
                  </Box>}
                  <div className="controls">
                    <IconButton className={trackState.audio ? "on" : ""}
                      onClick={() => mute("audio")}>
                      {trackState.audio ? <MicOff /> : <Mic />}
                    </IconButton>
                    <IconButton className={trackState.video ? "on" : ""}
                      onClick={() => mute("video")}>
                      {trackState.video ? <VideocamOff /> : <Videocam />}
                    </IconButton>
                    <IconButton onClick={() => leave()}><CallEnd /></IconButton>
                  </div>
                </DrawerSidebar>

                <Box flex={1} position={"relative"} display={"flex"} flexDirection={"column"}>
                  <Content>
                    <InsetContainer style={{ padding: 0, maxWidth: "100%" }}>
                      <React.Fragment>{children}</React.Fragment>
                    </InsetContainer>
                  </Content>
                </Box>
              </Box>
            </ThemeProvider>
          </StylesProvider>
        );
      }}
    </Root>
  )
}

export default DocumentWriteLayout