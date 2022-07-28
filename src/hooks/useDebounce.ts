import React from "react";
import debounce from "lodash/debounce";

export const useDebounce = <P extends unknown, R extends unknown>(
  fnToDebounce: (params: P) => R,
  durationInMs = 200
) => {
  if (isNaN(durationInMs)) {
    throw new TypeError("durationInMs for debounce should be a number");
  }

  if (fnToDebounce == null) {
    throw new TypeError("fnToDebounce cannot be null");
  }

  if (typeof fnToDebounce !== "function") {
    throw new TypeError("fnToDebounce should be a function");
  }

  return React.useCallback(debounce(fnToDebounce, durationInMs), [
    fnToDebounce,
    durationInMs,
  ]);
};

export default useDebounce;
