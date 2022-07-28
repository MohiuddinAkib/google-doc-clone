import React from "react";
import { JoteyQueryError } from "@src/types";
import { UseFormSetError } from "react-hook-form";
import { SerializedError } from "@reduxjs/toolkit";
import { addServerErrors, isJoteyQueryError } from "@utils/error-handling";

function useAddFieldErrorsFromServer<T>(
  error: JoteyQueryError | SerializedError | undefined,
  setError: UseFormSetError<T>
) {
  React.useEffect(() => {
    if (isJoteyQueryError(error)) {
      addServerErrors(
        error.data.field_errors as Record<keyof T, string>,
        setError
      );
    }
  }, [error, setError]);
}

export default useAddFieldErrorsFromServer;
