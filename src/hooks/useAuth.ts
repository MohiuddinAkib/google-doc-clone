import React from "react";
import { AuthContext } from "@src/AuthServiceProvider";

export const useAuth = () => {
  return React.useContext(AuthContext);
};
