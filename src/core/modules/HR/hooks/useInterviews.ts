// src/core/modules/HR/hooks/useInterviews.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { InterviewsService } from '../../../../api/service/HrService/InterviewsService';
import type { InterviewResultData, SubmitRankingData } from '../../../../api/service/HrService/Types/InterviewsService.types';

// تعريف نوع بيانات الجدولة
interface ScheduleData {
  candidate_id: number;
  interviewed_by: number;
  scheduled_at: string;
  location_type: string;
  location_details: string;
}

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

export const useInterviews = (jobId?: number) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['interviews', jobId],
    queryFn: () => InterviewsService.getByJobId(jobId!),
    enabled: !!jobId,
  });

  const schedule = useMutation({
    mutationFn: ({ jobId, data: scheduleData }: { jobId: number; data: ScheduleData }) => 
      InterviewsService.schedule(jobId, scheduleData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interviews', jobId] });
      toast.success('Interview scheduled');
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const updateResult = useMutation({
    mutationFn: ({ id, data: resultData }: { id: number; data: InterviewResultData }) => 
      InterviewsService.updateResult(id, resultData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interviews', jobId] });
      toast.success('Result updated');
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const cancel = useMutation({
    mutationFn: (id: number) => InterviewsService.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interviews', jobId] });
      toast.success('Interview cancelled');
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const { data: rankingResponse } = useQuery({
    queryKey: ['ranking', jobId],
    queryFn: () => InterviewsService.getRanking(jobId!),
    enabled: !!jobId,
  });

  const submitRanking = useMutation({
    mutationFn: ({ jobId, data: rankingPayload }: { jobId: number; data: SubmitRankingData }) => 
      InterviewsService.submitRanking(jobId, rankingPayload),
    onSuccess: () => toast.success('Ranking submitted'),
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  return {
    interviews: data?.data?.data || [],
    isLoading,
    error: error?.message || null,
    refetch,
    schedule: schedule.mutate,
    isScheduling: schedule.isPending,
    updateResult: updateResult.mutate,
    isUpdating: updateResult.isPending,
    cancel: cancel.mutate,
    isCancelling: cancel.isPending,
    ranking: rankingResponse?.data?.data || [],
    submitRanking: submitRanking.mutate,
  };
};