import React from "react";
import useDebounce from "./useDebounce";

export const useDebouncedState = <S extends unknown>(
  initialState: S,
  durationInMs: number = 500
) => {
  const [internalState, setInternalState] = React.useState<S>(initialState);

  const debouncedSetFunction = useDebounce<S, void>(
    setInternalState,
    durationInMs
  );

  React.useEffect(() => {
    debouncedSetFunction(initialState);

    return () => {
      debouncedSetFunction.cancel();
    };
  }, [initialState, debouncedSetFunction]);

  // return [internalState, debouncedSetFunction] as const;
  return React.useMemo(
    () => [internalState, debouncedSetFunction] as const,
    [internalState, debouncedSetFunction]
  );
};

export default useDebouncedState;
