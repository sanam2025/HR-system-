// src/core/modules/HR/hooks/useComplaints.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ComplaintsService } from '../../../../api/service/HrService/ComplaintsService';
import type {
  
  RespondComplaintData,
} from '../../../../api/service/HrService/Types/ComplaintsService.types';

// ✅ Get all complaints
export const useComplaints = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['complaints'],
    queryFn: async () => {
      const res = await ComplaintsService.getAll();
      return res.data?.data || [];
    },
  });

  return {
    complaints: data || [],
    isLoading,
    error: error?.message || null,
    refetch,
  };
};

// ✅ Get single complaint
export const useComplaint = (id?: number) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['complaint', id],
    queryFn: async () => {
      if (!id) return null;
      const res = await ComplaintsService.getById(id);
      return res.data?.data || null;
    },
    enabled: !!id,
  });

  return {
    complaint: data,
    isLoading,
    error: error?.message || null,
    refetch,
  };
};

// ✅ Mark as under review
export const useMarkUnderReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => ComplaintsService.markUnderReview(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
      queryClient.invalidateQueries({ queryKey: ['complaint'] });
      toast.success('✅ Review started');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to start review');
    },
  });
};

// ✅ Respond to complaint
export const useRespondComplaint = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: RespondComplaintData }) =>
      ComplaintsService.respond(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
      queryClient.invalidateQueries({ queryKey: ['complaint'] });
      toast.success('✅ Response sent successfully');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to send response');
    },
  });
};