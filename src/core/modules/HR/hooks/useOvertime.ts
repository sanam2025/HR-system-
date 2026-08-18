// src/core/modules/HR/hooks/useOvertime.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { OvertimeService } from '../../../../api/service/HrService/OvertimeService';
import { AxiosError } from 'axios';

// --- Queries ---
export const useMandatoryOvertime = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['mandatory-overtime'],
    queryFn: async () => {
      const res = await OvertimeService.getMandatory();
      return res.data?.data || [];
    },
  });
  // ✅ نضمن أن البيانات دائماً مصفوفة
  return { requests: data || [], isLoading, error: error?.message, refetch };
};

export const useVoluntaryOvertime = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['voluntary-overtime'],
    queryFn: async () => {
      const res = await OvertimeService.getVoluntary();
      return res.data?.data || [];
    },
  });
  // ✅ نضمن أن البيانات دائماً مصفوفة
  return { requests: data || [], isLoading, error: error?.message, refetch };
};

export const useDepartmentOvertime = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['department-overtime'],
    queryFn: async () => {
      const res = await OvertimeService.getDepartmentOvertime();
      return res.data?.data || [];
    },
  });
  // ✅ نضمن أن البيانات دائماً مصفوفة
  return { requests: data || [], isLoading, error: error?.message, refetch };
};

export const useOvertimeDetails = (id: number) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['overtime', id],
    queryFn: async () => {
      const res = await OvertimeService.getById(id);
      return res.data?.data || null;
    },
    enabled: !!id,
  });
  return { request: data, isLoading, error: error?.message, refetch };
};

// --- Mutations ---
export const useApproveMandatoryOvertime = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => OvertimeService.approveMandatory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mandatory-overtime'] });
      toast.success('✅ Mandatory overtime approved!');
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        const msg = err.response?.data as { message?: string };
        toast.error(msg?.message || 'Failed to approve');
      }
    },
  });
};

export const useRejectMandatoryOvertime = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => OvertimeService.rejectMandatory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mandatory-overtime'] });
      toast.success('❌ Mandatory overtime rejected!');
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        const msg = err.response?.data as { message?: string };
        toast.error(msg?.message || 'Failed to reject');
      }
    },
  });
};

export const useDeleteOvertime = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => OvertimeService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mandatory-overtime'] });
      queryClient.invalidateQueries({ queryKey: ['voluntary-overtime'] });
      toast.success('🗑️ Overtime request deleted!');
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        const msg = err.response?.data as { message?: string };
        toast.error(msg?.message || 'Failed to delete');
      }
    },
  });
};