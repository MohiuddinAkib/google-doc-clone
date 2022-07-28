import axios, { AxiosError } from "axios";
import {
  ServerErrorType,
  ServerNonFieldError,
  ServerValidationError,
} from "@src/types";

export class ApplicationError extends Error {
  constructor(private readonly data: AxiosError<ServerErrorType>) {
    super(data.message);
  }

  get response() {
    return this.data.response;
  }

  get request() {
    return this.data.request;
  }

  get field_errors(): Record<string, string> {
    if (this.isValidationError()) {
      const validationError = this.response!.data as ServerValidationError;

      return Object.entries(validationError.errors).reduce(
        (acc, [fieldName, [errorMessage]]) => {
          acc[fieldName] = errorMessage;
          return acc;
        },
        {} as Record<string, string>
      );
    }

    return {};
  }

  get status() {
    if (this.response) {
      return this.response.status;
    }

    return 0;
  }

  get non_field_error(): string {
    if (this.response) {
      const nonFieldError = this.response.data as ServerNonFieldError;

      if (nonFieldError.message) {
        return nonFieldError.message;
      }
    }

    if (this.isValidationError()) {
      const validationError = this.response!.data as ServerValidationError;
      return validationError.message;
    }

    if (this.isUnauthorizedError()) {
      return "You need to log in first.";
    }

    return this.message;
  }

  isNotFoundError(): boolean {
    if (this.response) {
      return this.response.status === 404;
    }

    return false;
  }

  isValidationError(): boolean {
    if (this.response) {
      return this.response.status === 422;
    }

    return false;
  }

  isUnauthorizedError() {
    if (this.response) {
      return this.response.status === 401;
    }

    return false;
  }

  isRequestCancellationError() {
    return axios.isCancel(this.data);
  }

  getFormattedMessage<TKey extends string = string>(): {
    non_field_error: string;
    field_errors: Record<TKey, string>;
  } {
    return {
      field_errors: this.field_errors as Record<TKey, string>,
      non_field_error: this.non_field_error,
    };
  }
}
