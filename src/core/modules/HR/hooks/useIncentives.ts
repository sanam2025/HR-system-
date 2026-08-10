// src/core/modules/HR/hooks/useIncentives.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { IncentivesService } from '../../../../api/service/HrService/IncentivesService';
import { AxiosError } from 'axios';

export const useIncentives = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['incentives'],
    queryFn: async () => {
      const res = await IncentivesService.getAll();
      // ✅ إرجاع البيانات مباشرة بدون استخدام as
      return res.data?.data || [];
    },
  });

  return {
    incentives: data || [], // ✅ TypeScript سيستنتج النوع تلقائياً
    isLoading,
    error: error?.message || null,
    refetch,
  };
};

export const useCreateIncentive = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { user_id: number; amount: number; reason: string; date: string }) =>
      IncentivesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incentives'] });
      toast.success('✅ Incentive created successfully!');
    },
    onError: (err) => {
      if (err instanceof AxiosError && err.response?.status === 422) {
        const data = err.response.data as Record<string, string[]>;
        const msg = Object.values(data)[0]?.[0];
        toast.error(msg || 'Validation error');
      } else {
        toast.error('Failed to create incentive');
      }
    },
  });
};