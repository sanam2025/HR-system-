// src/core/modules/HR/hooks/useCandidates.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { CandidatesService } from '../../../../api/service/HrService/CandidatesService';

// تعريف نوع الخطأ
interface ApiError {
  message: string;
  response?: {
    data?: {
      message?: string;
    };
  };
}

const getErrorMessage = (err: unknown): string => {
  const apiError = err as ApiError;
  if (apiError.response?.data?.message) {
    return apiError.response.data.message;
  }
  if (apiError.message) {
    return apiError.message;
  }
  return 'An error occurred';
};

export const useCandidates = (jobId?: number) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['candidates', jobId],
    queryFn: () => CandidatesService.getByJobId(jobId!),
    enabled: !!jobId,
  });

  const candidates = data?.data?.data || [];

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => 
      CandidatesService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidates', jobId] });
      toast.success('Status updated');
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const getCV = useMutation({
    mutationFn: (id: number) => CandidatesService.getCV(id),
    onSuccess: (res) => {
      const url = res.data?.data?.url;
      if (url) window.open(url, '_blank');
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  return {
    candidates,
    isLoading,
    error: error?.message || null,
    refetch,
    updateStatus: updateStatus.mutate,
    isUpdating: updateStatus.isPending,
    getCV: getCV.mutate,
    isLoadingCV: getCV.isPending,
  };
};