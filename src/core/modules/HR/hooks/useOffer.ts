// src/core/modules/HR/hooks/useOffer.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { OfferService, type SendOfferData } from '../../../../api/service/HrService/OfferService';

// ✅ جلب قائمة العروض
export const useOffers = (jobId?: number) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['offers', jobId],
    queryFn: async () => {
      if (!jobId) return [];
      const res = await OfferService.getByJobId(jobId);
      return res.data?.data || [];
    },
    enabled: !!jobId,
  });

  return {
    offers: data || [],
    isLoading,
    error: error?.message || null,
    refetch,
  };
};

// ✅ إرسال عرض وظيفي
export const useSendOffer = (jobId?: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SendOfferData) => {
      if (!jobId) throw new Error('Job ID is required');
      return OfferService.send(jobId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offers', jobId] });
      toast.success('Offer sent successfully');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to send offer');
    },
  });
};