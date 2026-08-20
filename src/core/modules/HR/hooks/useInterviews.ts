// src/core/modules/HR/hooks/useInterviews.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { InterviewsService } from '../../../../api/service/HrService/InterviewsService';

//  بدون interviewed_by (يتم تعيينه تلقائياً من السيرفر)
interface ScheduleData {
  candidate_id: number;
  scheduled_at: string;
  location_type: string;
  location_details: string;
}

interface ResultData {
  rate: number;
  notes: string;
}

interface RankingData {
  ranking: { interview_id: number; rank: number }[];
}

export const useInterviews = (jobId?: number) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['interviews', jobId],
    queryFn: async () => {
      if (!jobId) return [];
      
      try {
        const res = await InterviewsService.getAll(jobId);
        return res.data?.data || [];
      } catch {
        return [];
      }
    },
    enabled: !!jobId,
  });

  const interviews = data || [];

  const schedule = useMutation({
    mutationFn: (data: ScheduleData) => {
      if (!jobId) throw new Error('Job ID required');
      return InterviewsService.create(jobId, data as any);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interviews', jobId] });
      toast.success(' Interview scheduled successfully!');
    },
    onError: (err: Error) => toast.error(err.message || 'Schedule failed'),
  });

  const result = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ResultData }) =>
      InterviewsService.updateResult(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interviews', jobId] });
      toast.success('Result updated');
    },
    onError: (err: Error) => toast.error(err.message || 'Update failed'),
  });

  const cancel = useMutation({
    mutationFn: (id: number) => InterviewsService.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interviews', jobId] });
      toast.success('Interview cancelled');
    },
    onError: (err: Error) => toast.error(err.message || 'Cancel failed'),
  });

  const ranking = useQuery({
    queryKey: ['interviews-ranking', jobId],
    queryFn: async () => {
      if (!jobId) return [];
      const res = await InterviewsService.getRankedByRate(jobId);
      return res.data?.data || [];
    },
    enabled: !!jobId,
  });

  const submitRanking = useMutation({
    mutationFn: (data: RankingData) => {
      if (!jobId) throw new Error('Job ID required');
      return InterviewsService.submitRanking(jobId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interviews-ranking', jobId] });
      toast.success('Ranking saved');
    },
    onError: (err: Error) => toast.error(err.message || 'Failed to save ranking'),
  });

  return {
    interviews,
    isLoading,
    error: error?.message || null,
    refetch,
    scheduleInterview: schedule.mutate,
    isScheduling: schedule.isPending,
    updateResult: result.mutate,
    isUpdating: result.isPending,
    cancelInterview: cancel.mutate,
    isCancelling: cancel.isPending,
    ranking: ranking.data || [],
    isLoadingRanking: ranking.isLoading,
    submitRanking: submitRanking.mutate,
    isSubmittingRanking: submitRanking.isPending,
  };
};