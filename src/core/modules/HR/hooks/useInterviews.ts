// src/core/modules/HR/hooks/useInterviews.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { InterviewsService } from '../../../../api/service/HrService/InterviewsService';

// ✅ تعريف الأنواع لتتوافق مع الـ API
interface ScheduleData {
  candidate_id: number;
  interviewed_by: number;
  scheduled_at: string;
  location_type: string;
  location_details: string;
}

interface ResultData {
  rate: number;
  notes: string; // ✅ جعلها إجبارية بدلاً من optional
}

interface RankingData {
  ranking: { interview_id: number; rank: number }[];
}

export const useInterviews = (jobId?: number) => {
  const queryClient = useQueryClient();

  // ✅ جلب المقابلات
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['interviews', jobId],
    queryFn: async () => {
      if (!jobId) return [];
      const res = await InterviewsService.getByJobId(jobId);
      return res.data?.data || [];
    },
    enabled: !!jobId,
  });

  // ✅ جدولة مقابلة
  const schedule = useMutation({
    mutationFn: (data: ScheduleData) => {
      if (!jobId) throw new Error('Job ID required');
      return InterviewsService.schedule(jobId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interviews', jobId] });
      toast.success('Interview scheduled');
    },
    onError: (err: Error) => toast.error(err.message || 'Schedule failed'),
  });

  // ✅ تحديث النتيجة
  const result = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ResultData }) =>
      InterviewsService.updateResult(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interviews', jobId] });
      toast.success('Result updated');
    },
    onError: (err: Error) => toast.error(err.message || 'Update failed'),
  });

  // ✅ إلغاء المقابلة
  const cancel = useMutation({
    mutationFn: (id: number) => InterviewsService.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interviews', jobId] });
      toast.success('Interview cancelled');
    },
    onError: (err: Error) => toast.error(err.message || 'Cancel failed'),
  });

  // ✅ ترتيب المقابلات
  const ranking = useQuery({
    queryKey: ['interviews-ranking', jobId],
    queryFn: async () => {
      if (!jobId) return [];
      const res = await InterviewsService.getRanking(jobId);
      return res.data?.data || [];
    },
    enabled: !!jobId,
  });

  // ✅ حفظ الترتيب
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
    interviews: data || [],
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