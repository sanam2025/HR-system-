import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "../complaints";
import { queryKeys } from "../queryKeys";
import type { CreateComplaintPayload } from "../models";

export function useMyComplaints() {
  return useQuery({
    queryKey: queryKeys.complaints.mine(),
    queryFn: () => api.listMyComplaints(),
  });
}

export function useCreateComplaint() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateComplaintPayload) => api.createComplaint(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.complaints.all }),
  });
}
