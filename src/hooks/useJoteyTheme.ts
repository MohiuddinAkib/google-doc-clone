import React from "react";
import { AppServiceContext } from "@providers/AppServiceProvider";

function useJoteyTheme() {
  const appContext = React.useContext(AppServiceContext);

  return React.useMemo(() => appContext.theme, [appContext.theme]);
}

export default useJoteyTheme;
