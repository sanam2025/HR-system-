import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "../termination";
import { queryKeys } from "../queryKeys";
import type { CreateTerminationPayload } from "../models";

export function useMyTerminationRequests() {
  return useQuery({
    queryKey: queryKeys.termination.mine(),
    queryFn: () => api.listMyTerminationRequests(),
  });
}

export function useCreateTerminationRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateTerminationPayload) => api.createTerminationRequest(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.termination.all }),
  });
}

export function useDeleteTerminationRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => api.deleteTerminationRequest(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.termination.all }),
  });
}
