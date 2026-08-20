import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "../leaveRequests";
import { queryKeys } from "../queryKeys";
import type {
  CreateLeaveRequestPayload,
  LeaveRequestStatus,
  UpdateLeaveRequestPayload,
} from "../models";

export function useMyLeaveRequests(status?: LeaveRequestStatus, page: number = 1) {
  const params = status ? { status, page } : { page };
  return useQuery({
    queryKey: queryKeys.leaveRequests.mine(params),
    queryFn: () => api.listMyLeaveRequests(params),
  });
}

export function useLeaveRequest(id: number) {
  return useQuery({
    queryKey: queryKeys.leaveRequests.detail(id),
    queryFn: () => api.getLeaveRequest(id),
    enabled: Number.isFinite(id),
  });
}

export function useCreateLeaveRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateLeaveRequestPayload) => api.createLeaveRequest(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.leaveRequests.all }),
  });
}

export function useUpdateLeaveRequest(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateLeaveRequestPayload) => api.updateLeaveRequest(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.leaveRequests.all }),
  });
}

export function useDeleteLeaveRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.deleteLeaveRequest(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.leaveRequests.all }),
  });
}

export function useMyLeaveBalance() {
  return useQuery({
    queryKey: queryKeys.leaveRequests.myBalance(),
    queryFn: () => api.getMyLeaveBalance(),
  });
}
