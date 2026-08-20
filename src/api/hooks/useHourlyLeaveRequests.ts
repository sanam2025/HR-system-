import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "../hourlyLeaveRequests";
import { queryKeys } from "../queryKeys";
import type {
  CreateHourlyLeaveRequestPayload,
  LeaveRequestStatus,
  UpdateHourlyLeaveRequestPayload,
} from "../models";

export function useMyHourlyLeaveRequests(status?: LeaveRequestStatus, page: number = 1) {
  const params = status ? { status, page } : { page };
  return useQuery({
    queryKey: queryKeys.hourlyLeaveRequests.mine(params),
    queryFn: () => api.listMyHourlyLeaveRequests(params),
  });
}

export function useHourlyLeaveRequest(id: number) {
  return useQuery({
    queryKey: queryKeys.hourlyLeaveRequests.detail(id),
    queryFn: () => api.getHourlyLeaveRequest(id),
    enabled: Number.isFinite(id),
  });
}

export function useCreateHourlyLeaveRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateHourlyLeaveRequestPayload) =>
      api.createHourlyLeaveRequest(payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.hourlyLeaveRequests.all }),
  });
}

export function useUpdateHourlyLeaveRequest(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateHourlyLeaveRequestPayload) =>
      api.updateHourlyLeaveRequest(id, payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.hourlyLeaveRequests.all }),
  });
}

export function useDeleteHourlyLeaveRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.deleteHourlyLeaveRequest(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.hourlyLeaveRequests.all }),
  });
}
