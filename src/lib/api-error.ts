import { isAxiosError } from "axios";

// Shape of every error response from the backend
type ApiErrorBody = {
  success: false;
  message: string;
  errors?: { field: string; message: string }[];
};

export type ParsedApiError = {
  status?: number;
  message: string;
  fieldErrors: { field: string; message: string }[];
};

// Converts any thrown error into something the UI can show
export function parseApiError(error: unknown): ParsedApiError {
  if (isAxiosError<ApiErrorBody>(error)) {
    // Server replied with an error status
    if (error.response) {
      return {
        status: error.response.status,
        message: error.response.data?.message ?? "Something went wrong.",
        fieldErrors: error.response.data?.errors ?? [],
      };
    }
    // No response: server down, CORS blocked, or timeout
    return {
      message: "Cannot reach the server. Please try again in a moment.",
      fieldErrors: [],
    };
  }
  return { message: "Something went wrong.", fieldErrors: [] };
}
