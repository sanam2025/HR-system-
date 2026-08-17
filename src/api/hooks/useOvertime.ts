import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "../overtime";
import { queryKeys } from "../queryKeys";
import type { CreateOvertimePayload } from "../models";

export function useMyOvertimeRequests() {
  return useQuery({
    queryKey: queryKeys.overtime.mine(),
    queryFn: () => api.listMyOvertimeRequests(),
  });
}

export function useCreateOvertimeRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateOvertimePayload) => api.createOvertimeRequest(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.overtime.all }),
  });
}

export function useDeleteOvertimeRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => api.deleteOvertimeRequest(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.overtime.all }),
  });
}
