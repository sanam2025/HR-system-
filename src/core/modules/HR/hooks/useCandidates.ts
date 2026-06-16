// src/core/modules/HR/hooks/useCandidates.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { CandidatesService } from '../../../../api/service/HrService/CandidatesService';
import type { Candidate } from '../../../../api/service/HrService/Types/CandidatesService.types';
import { AxiosError } from 'axios';

// ✅ تعريف نوع خطأ الـ API
interface ApiErrorResponse {
  message?: string;
  errors?: Record<string, string[]>;
}

export const useCandidates = (jobId?: number) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery<Candidate[], Error>({
    queryKey: ['candidates', jobId],
    queryFn: async () => {
      if (!jobId || isNaN(jobId)) {
        return [] as Candidate[];
      }
      
      try {
        const response = await CandidatesService.getByJobId(jobId);
        return response.data?.data || [];
      } catch (err) {
        // ✅ التحقق من خطأ 404
        if (err instanceof AxiosError && err.response?.status === 404) {
          console.warn(`No candidates found for job ${jobId}`);
          return [] as Candidate[];
        }
        // ✅ إعادة رمي الخطأ
        throw err instanceof Error ? err : new Error('Unknown error occurred');
      }
    },
    enabled: !!jobId && !isNaN(jobId),
    retry: false,
  });

  const candidates = data || [];

  // ✅ معالجة الخطأ بشكل آمن
  let errorMessage: string | null = null;
  if (error) {
    if (error instanceof AxiosError && error.response?.status === 404) {
      errorMessage = null;
    } else {
      errorMessage = error.message || 'An error occurred while loading candidates';
    }
  }

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => 
      CandidatesService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidates', jobId] });
      toast.success('Status updated successfully');
    },
    onError: (err: unknown) => {
      let message = 'Failed to update status';
      if (err instanceof AxiosError) {
        const data = err.response?.data as ApiErrorResponse;
        message = data?.message || message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      toast.error(message);
    },
  });

  const getCV = useMutation({
    mutationFn: (id: number) => CandidatesService.getCV(id),
    onSuccess: (res) => {
      const url = res.data?.data?.url;
      if (url) window.open(url, '_blank');
    },
    onError: (err: unknown) => {
      let message = 'Failed to load CV';
      if (err instanceof AxiosError) {
        const data = err.response?.data as ApiErrorResponse;
        message = data?.message || message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      toast.error(message);
    },
  });

  return {
    candidates,
    isLoading,
    error: errorMessage,
    refetch,
    updateStatus: updateStatus.mutate,
    isUpdating: updateStatus.isPending,
    getCV: getCV.mutate,
    isLoadingCV: getCV.isPending,
  };
};