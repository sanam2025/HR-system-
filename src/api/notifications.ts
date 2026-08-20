import { getListOrEmpty, httpClient, unwrap } from "../lib/http/client";
import { endpoints } from "./endpoints";
import type { RequestOptions } from "../lib/http/client";
import type { MessageResponse } from "../lib/http/types";
import type { AppNotification } from "./models";

export async function listNotifications(options?: RequestOptions): Promise<AppNotification[]> {
  return getListOrEmpty<AppNotification>(endpoints.notifications.list, options);
}

export async function markNotificationRead(
  id: string,
  options?: RequestOptions
): Promise<MessageResponse> {
  const response = await httpClient.post(endpoints.notifications.markRead(id), undefined, options);
  return unwrap<MessageResponse>(response);
}
