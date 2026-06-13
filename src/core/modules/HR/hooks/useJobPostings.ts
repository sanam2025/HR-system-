// core/modules/HR/hooks/useJobPostings.ts
import { useCallback, useEffect, useState } from 'react';
import { jobPostingsService } from '../api/services/jobPostingsService';
import type { JobPosting, UpdateJobPostingData } from '../types/jobPosting.types';

interface UseJobPostingsReturn {
  postings: JobPosting[];
  loading: boolean;
  error: string | null;
  fetchAll: () => Promise<JobPosting[]>;
  getById: (id: number) => Promise<JobPosting>;
  update: (id: number, data: UpdateJobPostingData) => Promise<JobPosting>;
  close: (id: number) => Promise<JobPosting>;
  delete: (id: number) => Promise<void>;
}

interface ApiError {
  message: string;
  response?: { data?: { message?: string } };
}

const getErrorMessage = (err: ApiError): string => {
  if (err.response?.data?.message) return err.response.data.message;
  if (err.message) return err.message;
  return 'An unknown error occurred';
};

export const useJobPostings = (autoFetch: boolean = true): UseJobPostingsReturn => {
  const [postings, setPostings] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await jobPostingsService.getAllForHR();
      setPostings(data);
      return data;
    } catch (err) {
      setError(getErrorMessage(err as ApiError));
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getById = useCallback(async (id: number) => {
    return await jobPostingsService.getByIdForHR(id);
  }, []);

  const update = useCallback(async (id: number, data: UpdateJobPostingData) => {
    const result = await jobPostingsService.update(id, data);
    await fetchAll();
    alert('✅ Job posting updated successfully!');
    return result;
  }, [fetchAll]);

  const close = useCallback(async (id: number) => {
    const result = await jobPostingsService.close(id);
    await fetchAll();
    alert('🔒 Job posting closed');
    return result;
  }, [fetchAll]);

  const deletePosting = useCallback(async (id: number) => {
    if (window.confirm('Delete this job posting?')) {
      await jobPostingsService.delete(id);
      await fetchAll();
      alert('🗑️ Job posting deleted');
    }
  }, [fetchAll]);

  useEffect(() => {
    if (autoFetch) {
      fetchAll();
    }
  }, [autoFetch, fetchAll]);

  return {
    postings,
    loading,
    error,
    fetchAll,
    getById,
    update,
    close,
    delete: deletePosting,
  };
};