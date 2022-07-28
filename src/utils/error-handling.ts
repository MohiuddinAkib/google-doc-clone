import { UseFormSetError } from "react-hook-form";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { JoteyQueryError, ServerValidationError } from "@src/types";

export function addServerErrors<T>(
  errors: { [P in keyof T]: string } | Record<keyof T, string>,
  setError: UseFormSetError<T>
) {
  return Object.keys(errors).forEach((key) => {
    setError(key as any, {
      type: "server",
      message: errors[key as keyof T]!,
    });
  });
}

/**
 * Type predicate to narrow an unknown error to `FetchBaseQueryError`
 */
export function isFetchBaseQueryError(
  error: unknown
): error is FetchBaseQueryError {
  return typeof error === "object" && error != null && "status" in error;
}

/**
 * Type predicate to narrow an unknown error to an object with a string 'message' property
 */
export function isErrorWithMessage(
  error: unknown
): error is { message: string } {
  return (
    typeof error === "object" &&
    error != null &&
    "message" in error &&
    typeof (error as any).message === "string"
  );
}

/**
 * Type predicate to narrow an unknown error to an object with a string 'errors' property
 */
export function isValidationError(
  error: unknown
): error is ServerValidationError {
  return (
    typeof error === "object" &&
    error != null &&
    "errors" in error &&
    typeof (error as any).errors === "object"
  );
}

/**
 * Type predicate to narrow an unknown error to an object with a string 'errors' property
 */
export function isJoteyQueryError(error: unknown): error is JoteyQueryError {
  return (
    typeof error === "object" &&
    error != null &&
    "data" in error &&
    typeof (error as any).data.field_errors === "object"
  );
}
