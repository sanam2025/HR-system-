// src/core/modules/HR/hooks/useHourlyLeave.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { HourlyLeaveService } from '../../../../api/service/HrService/HourlyLeaveService';

// ✅ جلب كل الطلبات
export const useHourlyLeaveRequests = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['hourly-leave-requests'],
    queryFn: async () => {
      const res = await HourlyLeaveService.getAll();
      return res.data?.data || [];
    },
  });

  return {
    requests: data || [],
    isLoading,
    error: error?.message || null,
    refetch,
  };
};

// ✅ جلب تفاصيل طلب
export const useHourlyLeaveRequest = (id?: number) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['hourly-leave-request', id],
    queryFn: async () => {
      if (!id) return null;
      const res = await HourlyLeaveService.getById(id);
      return res.data?.data || null;
    },
    enabled: !!id,
  });

  return {
    request: data,
    isLoading,
    error: error?.message || null,
    refetch,
  };
};

// ✅ موافقة على طلب
export const useApproveHourlyLeave = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => HourlyLeaveService.approve(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hourly-leave-requests'] });
      toast.success('Hourly leave approved');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to approve');
    },
  });
};

// ✅ رفض طلب
export const useRejectHourlyLeave = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => HourlyLeaveService.reject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hourly-leave-requests'] });
      toast.success('Hourly leave rejected');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to reject');
    },
  });
};

// ✅ طلبات قسم معين
export const useDepartmentHourlyLeaveRequests = (status?: string) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['department-hourly-leave-requests', status],
    queryFn: async () => {
      const res = await HourlyLeaveService.getDepartmentRequests(status);
      return res.data?.data || [];
    },
  });

  return {
    requests: data || [],
    isLoading,
    error: error?.message || null,
    refetch,
  };
};

// ✅ كل طلبات القسم
export const useAllDepartmentHourlyLeaveRequests = (depId?: number) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['all-department-hourly-leave-requests', depId],
    queryFn: async () => {
      const res = await HourlyLeaveService.getAllDepartmentRequests(depId);
      return res.data?.data || [];
    },
    enabled: !!depId,
  });

  return {
    requests: data || [],
    isLoading,
    error: error?.message || null,
    refetch,
  };
};