// src/core/modules/HR/hooks/useJobPostings.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { JobPostingsService } from '../../../../api/service/HrService/JobPostingsService';

interface ApiError {
  message: string;
  response?: {
    data?: {
      message?: string;
    };
  };
}

interface UpdateJobPostingData {
  job_title?: string;
  description?: string;
  experience?: number;
  skills?: number[];
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

// ✅ جلب جميع الوظائف
export const useJobPostings = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['job-postings'],
    queryFn: () => JobPostingsService.getAll(),
  });

  const postings = data?.data?.data || [];

  return {
    postings,
    isLoading,
    error: error?.message || null,
    refetch,
  };
};

// ✅ جلب وظيفة واحدة
export const useJobPosting = (jobId?: number) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['jobPosting', jobId],
    queryFn: async () => {
      if (!jobId) return null;
      const res = await JobPostingsService.getById(jobId);
      return res.data?.data || null;
    },
    enabled: !!jobId,
  });

  return {
    job: data,
    isLoading,
    error: error?.message || null,
    refetch,
  };
};

// ✅ تحديث وظيفة
export const useUpdateJobPosting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateJobPostingData }) =>
      JobPostingsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-postings'] });
      queryClient.invalidateQueries({ queryKey: ['jobPosting'] });
      toast.success('Job posting updated');
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
};

// ✅ إغلاق وظيفة
export const useCloseJobPosting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => JobPostingsService.close(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-postings'] });
      queryClient.invalidateQueries({ queryKey: ['jobPosting'] });
      toast.success('Job posting closed');
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
};

// ✅ حذف وظيفة
export const useDeleteJobPosting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => JobPostingsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-postings'] });
      queryClient.invalidateQueries({ queryKey: ['jobPosting'] });
      toast.success('Job posting deleted');
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
};