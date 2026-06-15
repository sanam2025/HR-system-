// src/core/modules/HR/hooks/useJobPostings.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { JobPostingsService } from '../../../../api/service/HrService/JobPostingsService';

// تعريف نوع الخطأ
interface ApiError {
  message: string;
  response?: {
    data?: {
      message?: string;
    };
  };
}

// تعريف نوع بيانات التحديث
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

export const useJobPostings = () => {
  const queryClient = useQueryClient();

  const { data: response, isLoading, error, refetch } = useQuery({
    queryKey: ['job-postings'],
    queryFn: () => JobPostingsService.getAll(),
  });

  const postings = response?.data?.data || [];

  const close = useMutation({
    mutationFn: (id: number) => JobPostingsService.close(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['job-postings'] });
      toast.success(res.data?.message || 'Job posting closed');
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const deletePosting = useMutation({
    mutationFn: (id: number) => JobPostingsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-postings'] });
      toast.success('Job posting deleted');
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateJobPostingData }) => 
      JobPostingsService.update(id, data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['job-postings'] });
      toast.success(res.data?.message || 'Job posting updated');
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  return {
    postings,
    isLoading,
    error: error?.message || null,
    refetch,
    close: close.mutate,
    isClosing: close.isPending,
    delete: deletePosting.mutate,
    isDeleting: deletePosting.isPending,
    update: update.mutate,
    isUpdating: update.isPending,
  };
};