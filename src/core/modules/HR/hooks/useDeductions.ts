// src/core/modules/HR/hooks/useDeductions.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { DeductionsService } from '../../../../api/service/HrService/DeductionsService';
import { AxiosError } from 'axios';

export const useDeductions = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['deductions'],
    queryFn: async () => {
      const res = await DeductionsService.getAll();
      // ✅ إرجاع البيانات مباشرة بدون استخدام as
      return res.data?.data || [];
    },
  });

  return {
    deductions: data || [], // ✅ TypeScript سيستنتج النوع تلقائياً
    isLoading,
    error: error?.message || null,
    refetch,
  };
};

export const useCreateDeduction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { user_id: number; amount: number; reason: string; date: string }) =>
      DeductionsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deductions'] });
      toast.success('✅ Deduction created successfully!');
    },
    onError: (err) => {
      if (err instanceof AxiosError && err.response?.status === 422) {
        const data = err.response.data as Record<string, string[]>;
        const msg = Object.values(data)[0]?.[0];
        toast.error(msg || 'Validation error');
      } else {
        toast.error('Failed to create deduction');
      }
    },
  });
};