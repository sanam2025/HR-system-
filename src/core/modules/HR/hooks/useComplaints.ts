import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ComplaintsService } from '../../../../api/service/HrService/ComplaintsService';
import type {
  
  RespondComplaintData,
} from '../../../../api/service/HrService/Types/ComplaintsService.types';export const useComplaints = () => {
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
};export const useComplaint = (id?: number) => {
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
};export const useMarkUnderReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => ComplaintsService.markUnderReview(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
      queryClient.invalidateQueries({ queryKey: ['complaint'] });
      toast.success(' Review started');
    },
    onError: (err: any) => {
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to start review';
      toast.error(errorMessage);
    },
  });
};export const useRespondComplaint = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: RespondComplaintData }) =>
      ComplaintsService.respond(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
      queryClient.invalidateQueries({ queryKey: ['complaint'] });
      toast.success(' Response sent successfully');
    },
    onError: (err: any) => {
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to send response';
      toast.error(errorMessage);
    },
  });
};