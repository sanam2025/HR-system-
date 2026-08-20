// src/core/modules/HR/hooks/useAttendance.ts
import { useQuery } from '@tanstack/react-query';
import { AttendanceService } from '../../../../api/service/HrService/AttendanceService';

//  جلب حضور اليوم
export const useTodayAttendance = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['attendance-today'],
    queryFn: async () => {
      const res = await AttendanceService.getToday();
      return res.data?.data || [];
    },
  });

  return {
    records: data || [],
    isLoading,
    error: error?.message || null,
    refetch,
  };
};

//  جلب تحليل الحضور
export const useAttendanceAnalysis = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['attendance-analysis'],
    queryFn: async () => {
      const res = await AttendanceService.getAnalysis();
      return res.data?.data || null;
    },
  });

  return {
    stats: data || { total: 0, present: 0, absent: 0, late: 0 },
    isLoading,
    error: error?.message || null,
    refetch,
  };
};

//  جلب الحضور المفلتر
export const useFilteredAttendance = (from: string, to: string) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['attendance-filter', from, to],
    queryFn: async () => {
      if (!from || !to) return [];
      const res = await AttendanceService.getFiltered(from, to);
      return res.data?.data || [];
    },
    enabled: !!from && !!to,
  });

  return {
    records: data || [],
    isLoading,
    error: error?.message || null,
    refetch,
  };
};