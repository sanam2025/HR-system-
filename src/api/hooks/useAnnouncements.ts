import { useQuery } from "@tanstack/react-query";
import * as api from "../announcements";
import { queryKeys } from "../queryKeys";

export function useActiveAnnouncements() {
  return useQuery({
    queryKey: queryKeys.announcements.active(),
    queryFn: () => api.listActiveAnnouncements(),
  });
}
