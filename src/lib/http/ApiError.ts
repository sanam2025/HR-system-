import { isAxiosError } from "axios";
import type { AxiosError } from "axios";

/**
 * Shape Laravel returns for a 422 Unprocessable Entity validation failure
 * (the default `Illuminate\Validation\ValidationException` JSON response).
 */
interface LaravelValidationBody {
  message: string;
  errors: Record<string, string[]>;
}

/** Generic Laravel JSON error body (401 / 403 / 404 / 405 / 500 / ...). */
interface LaravelErrorBody {
  message?: string;
  error?: string;
}

export type ApiErrorKind =
  | "validation"
  | "unauthenticated"
  | "forbidden"
  | "not_found"
  | "conflict"
  | "rate_limited"
  | "server"
  | "network"
  | "cancelled"
  | "unknown";

/**
 * Normalized error thrown by every function in `src/api/*`.
 *
 * Every network call in this codebase funnels its failure through
 * {@link ApiError.from}, so callers (React Query `onError`, try/catch blocks,
 * UI toasts) only ever have to deal with a single, predictable shape instead
 * of guessing whether they got an `AxiosError`, a validation payload, or a
 * raw `Error` from a timed-out request.
 */
export class ApiError extends Error {
  readonly status: number | null;
  readonly kind: ApiErrorKind;
  readonly fieldErrors: Record<string, string[]>;
  readonly requestId?: string;
  readonly cause?: unknown;

  constructor(params: {
    message: string;
    status: number | null;
    kind: ApiErrorKind;
    fieldErrors?: Record<string, string[]>;
    requestId?: string;
    cause?: unknown;
  }) {
    super(params.message);
    this.name = "ApiError";
    this.status = params.status;
    this.kind = params.kind;
    this.fieldErrors = params.fieldErrors ?? {};
    this.requestId = params.requestId;
    this.cause = params.cause;
  }

  get isValidation(): boolean {
    return this.kind === "validation";
  }

  get isUnauthenticated(): boolean {
    return this.kind === "unauthenticated";
  }

  get isNetwork(): boolean {
    return this.kind === "network";
  }

  /** First validation message for a given field, if any (handy for forms). */
  fieldError(field: string): string | undefined {
    return this.fieldErrors[field]?.[0];
  }

  /** Builds an ApiError from anything an axios call can throw. */
  static from(error: unknown): ApiError {
    if (error instanceof ApiError) return error;

    if (isAxiosError(error)) {
      const axiosError = error as AxiosError<LaravelValidationBody | LaravelErrorBody>;

      if (axiosError.code === "ERR_CANCELED") {
        return new ApiError({
          message: "Request was cancelled.",
          status: null,
          kind: "cancelled",
          cause: error,
        });
      }

      if (!axiosError.response) {
        const timedOut = axiosError.code === "ECONNABORTED";
        return new ApiError({
          message: timedOut
            ? "The request timed out. Please check your connection and try again."
            : "Could not reach the server. Please check your connection.",
          status: null,
          kind: "network",
          cause: error,
        });
      }

      const { status, data } = axiosError.response;
      const requestId = axiosError.response.headers?.["x-request-id"] as
        | string
        | undefined;

      if (status === 422 && data && "errors" in data) {
        return new ApiError({
          message: data.message || "The submitted data is invalid.",
          status,
          kind: "validation",
          fieldErrors: data.errors,
          requestId,
          cause: error,
        });
      }

      const message =
        (data && "message" in data && data.message) ||
        (data && "error" in data && data.error) ||
        axiosError.message;

      switch (status) {
        case 401:
          return new ApiError({
            message: message || "Your session has expired. Please sign in again.",
            status,
            kind: "unauthenticated",
            requestId,
            cause: error,
          });
        case 403:
          return new ApiError({
            message: message || "You do not have permission to do that.",
            status,
            kind: "forbidden",
            requestId,
            cause: error,
          });
        case 404:
          return new ApiError({
            message: message || "The requested resource was not found.",
            status,
            kind: "not_found",
            requestId,
            cause: error,
          });
        case 409:
          return new ApiError({
            message: message || "This conflicts with the current state of the resource.",
            status,
            kind: "conflict",
            requestId,
            cause: error,
          });
        case 429:
          return new ApiError({
            message: message || "Too many requests. Please slow down and try again.",
            status,
            kind: "rate_limited",
            requestId,
            cause: error,
          });
        default:
          if (status >= 500) {
            return new ApiError({
              message: message || "Something went wrong on the server. Please try again.",
              status,
              kind: "server",
              requestId,
              cause: error,
            });
          }
          return new ApiError({
            message: message || "The request could not be completed.",
            status,
            kind: "unknown",
            requestId,
            cause: error,
          });
      }
    }

    if (error instanceof Error) {
      return new ApiError({
        message: error.message,
        status: null,
        kind: "unknown",
        cause: error,
      });
    }

    return new ApiError({
      message: "An unexpected error occurred.",
      status: null,
      kind: "unknown",
      cause: error,
    });
  }
}
