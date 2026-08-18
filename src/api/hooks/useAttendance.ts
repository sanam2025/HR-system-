import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "../attendance";
import { queryKeys } from "../queryKeys";

export function useCheckIn() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api.checkIn(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.attendance.all }),
  });
}

export function useCheckOut() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api.checkOut(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.attendance.all }),
  });
}

export function useMyMonthlyAttendance() {
  return useQuery({
    queryKey: queryKeys.attendance.myMonthly(),
    queryFn: () => api.getMyMonthlyAttendance(),
  });
}
