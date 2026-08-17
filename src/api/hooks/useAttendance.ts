import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "../attendance";
import { queryKeys } from "../queryKeys";
import { getCurrentPosition } from "../../lib/geolocation";
import type { AttendanceFilterParams } from "../models";

export function useCheckIn() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const coords = await getCurrentPosition();
      return api.checkIn(coords);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.attendance.all }),
  });
}

export function useCheckOut() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const coords = await getCurrentPosition();
      return api.checkOut(coords);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.attendance.all }),
  });
}

export function useMyMonthlyAttendance() {
  return useQuery({
    queryKey: queryKeys.attendance.myMonthly(),
    queryFn: () => api.getMyMonthlyAttendance(),
  });
}

/** Only fires once both `from` and `to` are set, so a half-filled filter form doesn't request. */
export function useFilteredAttendance(params: Partial<AttendanceFilterParams>) {
  const isReady = Boolean(params.from && params.to);
  return useQuery({
    queryKey: queryKeys.attendance.filtered(params),
    queryFn: () => api.getFilteredAttendance(params as AttendanceFilterParams),
    enabled: isReady,
  });
}

export function useAttendancePercentage() {
  return useQuery({
    queryKey: queryKeys.attendance.percentage(),
    queryFn: () => api.getAttendancePercentage(),
  });
}
