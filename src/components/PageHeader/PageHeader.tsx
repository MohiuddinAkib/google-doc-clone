import React from "react";
import {KeyboardArrowDown as KeyboardArrowDownIcon,} from "@material-ui/icons";
import {bindPopper, bindToggle, usePopupState,} from "material-ui-popup-state/hooks";
import {Avatar, Box, ClickAwayListener, Grid, Grow, MenuItem, MenuList, Paper, Popper,} from "@material-ui/core";

interface IProps {
    title: string;
}

const PageHeader = ({title}: IProps) => {

    const handleLogout = () => {
    };

    const userOptionsPopup = usePopupState({
        variant: "popover",
        popupId: "userOptions",
    });

    return (
        <Box mt={"104px"} height={83} borderBottom={1} borderColor={"primary.main"}>
            <Grid container justifyContent={"space-between"}>
                <Grid item>
                    <Box color={"primary.main"} fontWeight={700} fontSize={24}>
                        {title}
                    </Box>
                </Grid>

                <Grid item>
                    <Grid container alignItems={"center"} spacing={3}>
                        <Grid item>
                            {/* User name and options */}
                            <Box
                                px={2}
                                height={48}
                                display={"flex"}
                                borderRadius={5}
                                alignItems={"center"}
                                bgcolor={"primary.main"}
                            >
                                <Box color={"common.white"} fontWeight={600} fontSize={14}>
                                    auth user name
                                </Box>

                                <Box
                                    ml={7}
                                    px={2}
                                    py={"5px"}
                                    height={"100%"}
                                    display={"flex"}
                                    alignItems={"center"}
                                    bgcolor={"common.white"}
                                    style={{cursor: "pointer"}}
                                    justifyContent={"space-around"}
                                    {...bindToggle(userOptionsPopup)}
                                >
                                    <Avatar/>
                                    <KeyboardArrowDownIcon
                                        color={"primary"}
                                        style={{height: 32, width: 32}}
                                    />
                                </Box>
                                <Popper {...bindPopper(userOptionsPopup)} transition>
                                    {({TransitionProps, placement}) => (
                                        <Grow
                                            {...TransitionProps}
                                            style={{
                                                transformOrigin:
                                                    placement === "bottom"
                                                        ? "center top"
                                                        : "center bottom",
                                            }}
                                        >
                                            <Paper>
                                                <ClickAwayListener onClickAway={userOptionsPopup.close}>
                                                    <MenuList
                                                        autoFocusItem={userOptionsPopup.isOpen}
                                                        id="menu-list-grow"
                                                    >
                                                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                                                    </MenuList>
                                                </ClickAwayListener>
                                            </Paper>
                                        </Grow>
                                    )}
                                </Popper>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
};

export default PageHeader;
