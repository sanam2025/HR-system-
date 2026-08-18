import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "../resignations";
import { queryKeys } from "../queryKeys";
import type { CreateResignationPayload } from "../models";

export function useMyResignations() {
  return useQuery({
    queryKey: queryKeys.resignations.mine(),
    queryFn: () => api.listMyResignations(),
  });
}

export function useCreateResignation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateResignationPayload) => api.createResignation(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.resignations.all }),
  });
}
