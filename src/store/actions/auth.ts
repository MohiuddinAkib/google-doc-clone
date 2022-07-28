import { createAction } from "@reduxjs/toolkit";

export const loggedOut = createAction<void>("auth/loggedOut");
export const tokenReceived = createAction<string>("auth/tokenReceived");
