import { isAxiosError } from "axios";

export type FieldError = { field: string; message: string };

export class ApiError extends Error {
  status?: number;
  fieldErrors: FieldError[];

  constructor(
    message: string,
    status?: number,
    fieldErrors: FieldError[] = [],
  ) {
    super(message);
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

type ErrorBody = { message?: string; errors?: FieldError[] };

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;

  if (isAxiosError<ErrorBody>(error)) {
    if (error.response) {
      const { data, status } = error.response;
      return new ApiError(
        data?.message ?? "Something went wrong.",
        status,
        data?.errors ?? [],
      );
    }
    return new ApiError(
      error.code === "ECONNABORTED"
        ? "The request timed out. Please try again."
        : "Cannot reach the server. Please try again in a moment.",
    );
  }

  return new ApiError("Something went wrong.");
}
