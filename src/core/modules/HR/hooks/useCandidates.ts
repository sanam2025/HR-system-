import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { CandidatesService } from '../../../../api/service/HrService/CandidatesService';
import type { Candidate } from '../../../../api/service/HrService/Types/CandidatesService.types';
import { AxiosError } from 'axios';

export const useCandidates = (jobId?: number) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery<Candidate[], Error>({
    queryKey: ['candidates', jobId],
    queryFn: async () => {
      if (!jobId || isNaN(jobId) || jobId <= 0) {
        return [];
      }

      try {
        const response = await CandidatesService.getByJobId(jobId);
        return response.data?.data || [];
      } catch (err) {
        if (err instanceof AxiosError && err.response?.status === 404) {
          return [];
        }
        throw err instanceof Error ? err : new Error('Unknown error');
      }
    },
    enabled: !!jobId && !isNaN(jobId) && jobId > 0,
    retry: false,
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      CandidatesService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidates', jobId] });
      toast.success('Status updated');
    },
    onError: () => toast.error('Failed to update status'),
  });

  const getCV = useMutation({
    mutationFn: (id: number) => CandidatesService.getCV(id),
    onSuccess: (res) => {
      const url = res.data?.data?.url;
      if (url) window.open(url, '_blank');
    },
    onError: () => toast.error('Failed to load CV'),
  });

  return {
    candidates: data || [],
    isLoading,
    error: error?.message || null,
    refetch,
    updateStatus: updateStatus.mutate,
    isUpdating: updateStatus.isPending,
    getCV: getCV.mutate,
    isLoadingCV: getCV.isPending,
  };
};