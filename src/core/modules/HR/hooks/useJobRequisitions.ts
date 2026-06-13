// core/modules/HR/hooks/useJobRequisitions.ts
import { useCallback, useEffect, useState } from 'react';
import { jobRequisitionsService } from '../api/services/jobRequisitionsService';
import type { JobRequisition, CreateJobRequisitionData } from '../api/services/jobRequisitionsService';

interface UseJobRequisitionsReturn {
  requests: JobRequisition[];
  loading: boolean;
  error: string | null;
  fetchAll: () => Promise<JobRequisition[]>;
  fetchAllForHR: () => Promise<JobRequisition[]>;
  getById: (id: number) => Promise<JobRequisition>;
  create: (data: CreateJobRequisitionData) => Promise<JobRequisition>;
  update: (id: number, data: Partial<CreateJobRequisitionData>) => Promise<JobRequisition>;
  delete: (id: number) => Promise<void>;
  approve: (id: number) => Promise<JobRequisition>;
  reject: (id: number) => Promise<JobRequisition>;
  getPrefill: (id: number) => Promise<Partial<JobRequisition>>;
}

interface ApiError {
  message: string;
  response?: {
    data?: {
      message?: string;
    };
  };
}

const getErrorMessage = (err: ApiError): string => {
  if (err.response?.data?.message) return err.response.data.message;
  if (err.message) return err.message;
  return 'An unknown error occurred';
};

export const useJobRequisitions = (autoFetch: boolean = true): UseJobRequisitionsReturn => {
  const [requests, setRequests] = useState<JobRequisition[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await jobRequisitionsService.getAll();
      setRequests(data);
      return data;
    } catch (err) {
      const message = getErrorMessage(err as ApiError);
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAllForHR = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await jobRequisitionsService.getAllForHR();
      setRequests(data);
      return data;
    } catch (err) {
      const message = getErrorMessage(err as ApiError);
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getById = useCallback(async (id: number) => {
    return await jobRequisitionsService.getById(id);
  }, []);

  const create = useCallback(async (data: CreateJobRequisitionData) => {
    const result = await jobRequisitionsService.create(data);
    await fetchAll();
    alert('✅ Job requisition created successfully!');
    return result;
  }, [fetchAll]);

  const update = useCallback(async (id: number, data: Partial<CreateJobRequisitionData>) => {
    const result = await jobRequisitionsService.update(id, data);
    await fetchAll();
    alert('✅ Job requisition updated successfully!');
    return result;
  }, [fetchAll]);

  const deleteRequest = useCallback(async (id: number) => {
    if (window.confirm('Are you sure you want to delete this request?')) {
      try {
        await jobRequisitionsService.delete(id);
        await fetchAll();
        alert('🗑️ Job requisition deleted successfully');
      } catch (err) {
        const message = getErrorMessage(err as ApiError);
        alert('❌ Failed to delete: ' + message);
      }
    }
  }, [fetchAll]);

  const approve = useCallback(async (id: number) => {
    try {
      const result = await jobRequisitionsService.approve(id);
      await fetchAll();
      alert('✅ Request approved successfully!');
      return result;
    } catch (err) {
      const message = getErrorMessage(err as ApiError);
      alert('❌ Failed to approve: ' + message);
      throw err;
    }
  }, [fetchAll]);

  const reject = useCallback(async (id: number) => {
    try {
      const result = await jobRequisitionsService.reject(id);
      await fetchAll();
      alert('❌ Request rejected');
      return result;
    } catch (err) {
      const message = getErrorMessage(err as ApiError);
      alert('❌ Failed to reject: ' + message);
      throw err;
    }
  }, [fetchAll]);

  const getPrefill = useCallback(async (id: number) => {
    return await jobRequisitionsService.getPrefill(id);
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchAll();
    }
  }, [autoFetch, fetchAll]);

  return {
    requests,
    loading,
    error,
    fetchAll,
    fetchAllForHR,
    getById,
    create,
    update,
    delete: deleteRequest,
    approve,
    reject,
    getPrefill,
  };
};