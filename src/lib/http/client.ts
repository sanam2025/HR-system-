import axios from "axios";
import type { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { ApiError } from "./ApiError";
import { isLaravelPaginated, normalizePaginated } from "./types";
import type { Paginated } from "./types";
import { getAuthToken } from "../../store/authStore";

const RETRYABLE_METHODS = new Set(["get", "head", "options"]);
const MAX_RETRIES = 2;
const RETRY_BASE_DELAY_MS = 300;

declare module "axios" {
  interface InternalAxiosRequestConfig {
    __retryCount?: number;
  }
}

/**
 * Fired whenever the API rejects a request with 401 Unauthenticated. The
 * root of the app (see `main.tsx` / route guards) subscribes to this so an
 * expired/invalid token clears the session and redirects to `/login`
 * regardless of which hook or component triggered the failing request.
 */
export const SESSION_EXPIRED_EVENT = "masar-hr:session-expired";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: Number(import.meta.env.VITE_API_TIMEOUT_MS ?? 15000),
  headers: {
    Accept: "application/json",
  },
});

httpClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAuthToken();
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  // Let the browser set the multipart boundary itself; a manually-set
  // Content-Type on FormData bodies silently breaks file uploads.
  if (config.data instanceof FormData) {
    config.headers.delete("Content-Type");
  }
  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error?.config as InternalAxiosRequestConfig | undefined;
    const status = error?.response?.status as number | undefined;

    const method = (config?.method ?? "get").toLowerCase();
    const isRetryable =
      config &&
      !error.response && // network/timeout only — never retry a real HTTP error response
      RETRYABLE_METHODS.has(method) &&
      (config.__retryCount ?? 0) < MAX_RETRIES;

    if (isRetryable) {
      config.__retryCount = (config.__retryCount ?? 0) + 1;
      await sleep(RETRY_BASE_DELAY_MS * 2 ** (config.__retryCount - 1));
      return httpClient(config);
    }

    if (status === 401) {
      window.dispatchEvent(new CustomEvent(SESSION_EXPIRED_EVENT));
    }

    return Promise.reject(ApiError.from(error));
  }
);

/**
 * Keys this backend puts alongside `data` on a plain (non-paginated)
 * envelope — confirmed live on `GET /notifications`
 * (`{ "message": "...", "data": [...] }`), and consistent with the mixed
 * envelopes already documented for login in CHANGELOG.md. None of these
 * carry real payload, so their presence shouldn't stop `data` from being
 * unwrapped.
 */
const ENVELOPE_ONLY_KEYS = new Set(["message", "success", "status_code", "status", "errors"]);

function unwrapEnvelope<T>(body: unknown): { unwrapped: true; value: T } | { unwrapped: false } {
  if (body && typeof body === "object" && "data" in (body as Record<string, unknown>)) {
    const otherKeys = Object.keys(body as Record<string, unknown>).filter((k) => k !== "data");
    if (otherKeys.length === 0 || otherKeys.every((k) => ENVELOPE_ONLY_KEYS.has(k))) {
      return { unwrapped: true, value: (body as { data: T }).data };
    }
  }
  return { unwrapped: false };
}

/**
 * Unwraps a Laravel response body, transparently handling the shapes we
 * observe in practice: a bare payload, a Laravel API Resource wrapper
 * (`{ data: T }`), a `{ message, data: T }` envelope, and a paginator
 * (`{ data: T[], meta, links }`). See the "Undocumented response contracts"
 * note in CHANGELOG.md for why this exists instead of a single strict type
 * per endpoint.
 */
export function unwrap<T>(response: AxiosResponse<unknown>): T {
  const body = response.data;
  if (isLaravelPaginated<T extends Array<infer U> ? U : never>(body)) {
    return body as T;
  }
  const envelope = unwrapEnvelope<T>(body);
  if (envelope.unwrapped) return envelope.value;
  return body as T;
}

export function unwrapPaginated<T>(response: AxiosResponse<unknown>): Paginated<T> {
  const body = response.data;
  if (isLaravelPaginated<T>(body)) {
    return normalizePaginated(body);
  }
  const envelope = unwrapEnvelope<T[]>(body);
  const items = envelope.unwrapped
    ? envelope.value
    : Array.isArray(body)
      ? (body as T[])
      : [];
  return { items, page: 1, perPage: items.length, total: items.length, lastPage: 1 };
}

export type RequestOptions = Pick<AxiosRequestConfig, "signal" | "params" | "headers">;

/**
 * CONFIRMED via live backend testing: `GET /my-payslips` returns
 * `404 { "message": "No payslips found." }` rather than `200 []` when the
 * signed-in employee simply has no payslips yet. Treating a 404 as "empty"
 * for these self-service list endpoints turns a legitimate empty state
 * back into one instead of surfacing it as an error banner — the same
 * anti-pattern is plausible on every other "my-*" list route this backend
 * exposes, so every list module in `src/api/*` routes its GET through this
 * instead of a raw `unwrap(httpClient.get(...))`.
 */
export async function getListOrEmpty<T>(
  path: string,
  options?: RequestOptions
): Promise<T[]> {
  try {
    const response = await httpClient.get(path, options);
    return unwrap<T[]>(response);
  } catch (error) {
    const apiError = ApiError.from(error);
    if (apiError.kind === "not_found") return [];
    throw apiError;
  }
}
