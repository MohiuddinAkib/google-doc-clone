import React from "react";
import { AppServiceContext } from "@providers/AppServiceProvider";

const useAppContext = () => React.useContext(AppServiceContext);

export default useAppContext;
