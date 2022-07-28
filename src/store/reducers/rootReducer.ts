import { api } from "@data/laravel/services/api";
import notistackReducer from "./notistackReducer";
import authReducer from "@store/slices/authSlice";
import { combineReducers } from "@reduxjs/toolkit";

const rootReducer = combineReducers({
  auth: authReducer,
  notistack: notistackReducer,
  [api.reducerPath]: api.reducer,
});

export default rootReducer;
