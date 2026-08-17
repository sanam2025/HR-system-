import { httpClient, unwrap, unwrapPaginated } from "../lib/http/client";
import { endpoints } from "./endpoints";
import type { RequestOptions } from "../lib/http/client";
import type { MessageResponse, Paginated } from "../lib/http/types";
import type { Notification } from "./models";

/**
 * The signed-in user's own notifications.
 *
 * Confirmed via a live "items.filter is not a function" runtime error that
 * this endpoint returns Laravel's default paginator envelope (`{ data, meta,
 * links }`), not a bare array — `unwrapPaginated` (same helper `tasks.ts`
 * uses) handles that, with a bare-array fallback if that ever changes.
 */
export async function listNotifications(
  options?: RequestOptions
): Promise<Paginated<Notification>> {
  const response = await httpClient.get(endpoints.notifications.list, options);
  return unwrapPaginated<Notification>(response);
}

export async function markNotificationRead(
  id: string,
  options?: RequestOptions
): Promise<MessageResponse> {
  const response = await httpClient.post(
    endpoints.notifications.markRead(id),
    undefined,
    options
  );
  return unwrap<MessageResponse>(response);
}
