import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "../overtime";
import { queryKeys } from "../queryKeys";
import type { CreateOvertimePayload } from "../models";

export function useMyOvertimes() {
  return useQuery({
    queryKey: queryKeys.overtime.mine(),
    queryFn: () => api.listMyOvertimes(),
  });
}

export function useStoreOvertimeByEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateOvertimePayload) => api.storeOvertimeByEmployee(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.overtime.all }),
  });
}
