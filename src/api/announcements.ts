import { getListOrEmpty } from "../lib/http/client";
import { endpoints } from "./endpoints";
import type { RequestOptions } from "../lib/http/client";
import type { Announcement } from "./models";

export async function listActiveAnnouncements(options?: RequestOptions): Promise<Announcement[]> {
  return getListOrEmpty<Announcement>(endpoints.announcements.active, options);
}
