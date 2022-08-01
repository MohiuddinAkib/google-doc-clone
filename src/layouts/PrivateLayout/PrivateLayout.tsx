import React from "react";
import { Link } from "react-router-dom";
import useApp from "@hooks/useAppContext";
import { Helmet } from "react-helmet-async";
import { State } from "@mui-treasury/layout/types";
import styled, { ThemeProvider } from "styled-components";
import { usePopupState } from "material-ui-popup-state/hooks";
import { bindMenu, bindTrigger } from "material-ui-popup-state";
import { createStyles, makeStyles, StylesProvider, useTheme, } from "@material-ui/core/styles";
import Layout, {
    Root,
    getFooter,
    getHeader,
    getContent,
    getSidebarTrigger,
    getInsetContainer,
    getInsetAvoidingView,
} from "@mui-treasury/layout";
import {
    Box,
    Fade,
    Menu,
    Switch,
    Avatar,
    Toolbar,
    MenuItem,
    Typography,
    IconButton,
    CssBaseline,
    ListItemIcon,
    ListItemText,
    ListItemSecondaryAction,
} from "@material-ui/core";
import {
    Settings as SettingsIcon,
    ExitToApp as ExitToAppIcon,
    Brightness5 as Brightness5Icon,
    Brightness7 as Brightness7Icon,
} from "@material-ui/icons";
import { useLogoutMutation } from "@data/laravel/services/api";

const Header = getHeader(styled);
const Footer = getFooter(styled);
const Content = getContent(styled);
const SidebarTrigger = getSidebarTrigger(styled);
const InsetContainer = getInsetContainer(styled);
const InsetAvoidingView = getInsetAvoidingView(styled);

const scheme = Layout();

const useStyles = makeStyles((theme) =>
    createStyles({
        content: {
            flex: 1
        },
        leftDrawerPaperAnchorLeft: {

        },
        collapseBtn: {
        },
        header: {
        },
        headerToolbar: {

        },
        drawerSidebarContent: {
        },
        drawerSidebarContentColse: {},
        navItemRoot: {

        },
        navItemNested: {

        },
        navItemSelected: {

        },
        navPrimaryText: {
            fontSize: 16,
            fontWeight: 700,
            // color: theme.palette.common.white,
            transition: theme.transitions.create(["opacity", "lineHeight"], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
        navPrimaryTextCollapsed: {

        },
        navIcon: {
        },
        menuPaper: {
        },
        notificationTrayPaper: {

        },
    })
);

const PrivateLayout: React.FC = (props) => {
    const app = useApp();
    const theme = useTheme();
    const classes = useStyles();
    const [logout] = useLogoutMutation()
    const [layoutState] = React.useState<State>({
        sidebar: {
            left_sidebar: {
                open: true,
                collapsed: false,
            },
        },
    });
    const accountMenuPopupState = usePopupState({
        variant: "popover",
        popupId: "primary-search-account-menu",
    });



    scheme.configureHeader((builder) => {
        builder
            .registerConfig("xs", {
                position: "sticky",
                initialHeight: 64,
            })
            .registerConfig("md", {
                position: "relative", // won't stick to top when scroll down
                initialHeight: 64,
            });
    });



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
                                    <title>{"BUBT DOCS"}</title>
                                </Helmet>

                                <Header
                                    elevation={0}
                                    position={"fixed"}
                                    className={classes.header}
                                >
                                    <Toolbar className={classes.headerToolbar}>
                                        <SidebarTrigger sidebarId={"left_sidebar"} />

                                        <Box flex={1} pl={3}></Box>

                                        <Box mr={3}>
                                            {/* <IconButton
                                                size={"small"}
                                                {...bindTrigger(notificationMenuPopupState)}
                                                onClick={(event) => {
                                                    notificationMenuPopupState.open(event);
                                                }}
                                            >
                                                <Badge
                                                    variant={"dot"}
                                                    color={"primary"}
                                                    overlap={"circular"}
                                                >
                                                    <NotificationsNoneIcon />
                                                </Badge>
                                            </IconButton> */}
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
                                    {...bindMenu(accountMenuPopupState)}
                                    transformOrigin={{
                                        vertical: "top",
                                        horizontal: "center",
                                    }}
                                    PaperProps={{
                                        square: true,
                                    }}
                                    classes={{
                                        paper: classes.menuPaper,
                                    }}
                                    TransitionComponent={Fade}
                                    variant={"selectedMenu"}
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

                                    {/* <MenuItem button component={Link} to={"/settings"}>
                                        <ListItemIcon>
                                            <SettingsIcon />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={"Settings"}
                                            primaryTypographyProps={{
                                                color: "textSecondary",
                                            }}
                                        />
                                    </MenuItem> */}

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

                                <Box flex={1} position={"relative"} display={"flex"} flexDirection={"column"}>
                                    <Content className={classes.content}>
                                        <InsetContainer maxWidth={"xl"}>
                                            <React.Fragment>{props.children}</React.Fragment>
                                        </InsetContainer>
                                    </Content>

                                    <Footer >
                                        <InsetAvoidingView>
                                            <div>
                                                <Toolbar>
                                                    <Typography variant={"overline"} align={"center"}>
                                                        {new Date().getFullYear()} &copy;{" "}

                                                    </Typography>
                                                    <Box component={"span"} ml={0.5}>
                                                        Developed By FIFOTech v2.0.0
                                                    </Box>
                                                </Toolbar>
                                            </div>
                                        </InsetAvoidingView>
                                    </Footer>
                                </Box>
                            </Box>
                        </ThemeProvider>
                    </StylesProvider>
                );
            }}
        </Root>
    );
};

export default PrivateLayout;
