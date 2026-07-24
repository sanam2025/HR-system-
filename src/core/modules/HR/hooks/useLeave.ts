// src/core/modules/HR/hooks/useLeave.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { LeaveService } from '../../../../api/service/HrService/LeaveService';

// جلب كل الطلبات
export const useLeaveRequests = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['leave-requests'],
    queryFn: async () => {
      const res = await LeaveService.getAll();
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

// جلب تفاصيل طلب
export const useLeaveRequest = (id?: number) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['leave-request', id],
    queryFn: async () => {
      if (!id) return null;
      const res = await LeaveService.getById(id);
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

// موافقة على طلب
export const useApproveLeave = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => LeaveService.approve(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave-requests'] });
      toast.success('Leave request approved');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to approve leave');
    },
  });
};

// رفض طلب
export const useRejectLeave = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => LeaveService.reject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave-requests'] });
      toast.success('Leave request rejected');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to reject leave');
    },
  });
};

// رصيد إجازات موظف
export const useLeaveBalance = (employeeId?: number) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['leave-balance', employeeId],
    queryFn: async () => {
      if (!employeeId) return null;
      const res = await LeaveService.getBalance(employeeId);
      return res.data?.data || null;
    },
    enabled: !!employeeId,
  });

  return {
    balance: data || { annual: 0, sick: 0, emergency: 0, unpaid: 0 },
    isLoading,
    error: error?.message || null,
    refetch,
  };
};

// طلبات قسم معين
export const useDepartmentLeaveRequests = (status?: string) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['department-leave-requests', status],
    queryFn: async () => {
      const res = await LeaveService.getDepartmentRequests(status);
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

// كل طلبات الإجازات (مع فلترة)
export const useAllLeaveRequests = (from?: string, to?: string) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['all-leave-requests', from, to],
    queryFn: async () => {
      const res = await LeaveService.getAllRequests(from, to);
      return res.data?.data || [];
    },
    enabled: !!from && !!to,
  });

  return {
    requests: data || [],
    isLoading,
    error: error?.message || null,
    refetch,
  };
};