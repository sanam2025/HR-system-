import { httpClient, unwrap } from "../lib/http/client";
import { endpoints } from "./endpoints";
import type { RequestOptions } from "../lib/http/client";
import type { MessageResponse } from "../lib/http/types";
import type { AuthUser } from "../store/authStore";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResult {
  token: string;
  user: AuthUser;
}

export interface ChangePasswordPayload {
  password: string;
  password_confirmation: string;
}

/**
 * NOTE: the Postman collection sends `email`/`password` as query-string
 * parameters on the login request rather than a JSON body. Sending
 * credentials in a URL means they end up in server access logs, browser
 * history, and any request logging middleware — this frontend always sends
 * them as a JSON body instead. See CHANGELOG.md ("Credentials sent via
 * query string").
 */
export async function login(
  payload: LoginPayload,
  options?: RequestOptions
): Promise<LoginResult> {
  const response = await httpClient.post(endpoints.auth.login, payload, options);
  // Backend responses are inconsistent. Normalize common shapes we observe:
  // - { token, user }
  // - { Token, data: { user } }
  // - { message, data: { user }, Token }
  const body = response.data as any;

  const token = body.token ?? body.Token ?? body.access_token ?? body.data?.token ?? body.data?.Token;

  const rawUser = body.user ?? body.data?.user ?? body.data ?? null;

  const user: AuthUser = {
    id: rawUser?.id,
    fullName: rawUser?.full_name ?? rawUser?.fullName ?? rawUser?.name ?? "",
    email: rawUser?.email ?? "",
    role: (rawUser?.role as AuthUser["role"]) ?? "employee",
    departmentId: rawUser?.dep_id ?? rawUser?.department_id ?? rawUser?.departmentId ?? null,
    avatarUrl: rawUser?.avatar_url ?? rawUser?.avatar ?? null,
  };

  return { token, user } as LoginResult;
}

export async function logout(options?: RequestOptions): Promise<MessageResponse> {
  const response = await httpClient.post(endpoints.auth.logout, undefined, options);
  return unwrap<MessageResponse>(response);
}

/**
 * NOTE: named "putPassword" in the collection but is implemented as a GET
 * with only an `email` query param — it cannot actually change a password.
 * Kept here as `fetchUserByEmail` (its only real behavior) pending a real
 * `PUT /users/{id}/password` endpoint from the backend. See CHANGELOG.md.
 */
export async function fetchUserByEmail(
  email: string,
  options?: RequestOptions
): Promise<AuthUser> {
  const response = await httpClient.get(endpoints.auth.user, {
    ...options,
    params: { email, ...options?.params },
  });
  return unwrap<AuthUser>(response);
}

export async function changePassword(
  payload: ChangePasswordPayload,
  options?: RequestOptions
): Promise<MessageResponse> {
  const response = await httpClient.post(endpoints.auth.changePassword, payload, options);
  return unwrap<MessageResponse>(response);
}
