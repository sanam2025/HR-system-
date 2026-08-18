// src/core/modules/HR/hooks/usePerformance.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { PerformanceService } from '../../../../api/service/HrService/PerformanceService';
import { AxiosError } from 'axios';

// جلب التقييمات المعلقة
export const usePendingEvaluations = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['pending-evaluations'],
    queryFn: async () => {
      const res = await PerformanceService.getPendingEvaluations();
      return res.data?.data || [];
    },
  });
  return { evaluations: data || [], isLoading, error: error?.message, refetch };
};

// جلب تفاصيل تقييم معين
export const useEvaluationDetails = (id: number) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['evaluation', id],
    queryFn: async () => {
      const res = await PerformanceService.getEvaluationById(id);
      return res.data?.data || null;
    },
    enabled: !!id,
  });
  return { evaluation: data, isLoading, error: error?.message, refetch };
};

// اعتماد التقييم (إضافة ملاحظات HR)
export const useApproveEvaluation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, hr_notes }: { id: number; hr_notes: string }) =>
      PerformanceService.approveEvaluation(id, { hr_notes }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-evaluations'] });
      toast.success('✅ Evaluation approved successfully!');
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        const msg = err.response?.data as { message?: string };
        toast.error(msg?.message || 'Failed to approve evaluation');
      }
    },
  });
};