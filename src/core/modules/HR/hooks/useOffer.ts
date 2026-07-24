// src/core/modules/HR/hooks/useOffer.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { OfferService } from '../../../../api/service/HrService/OfferService';
import type { CreateOfferData } from '../../../../api/service/HrService/Types/OfferService.types';
import { AxiosError } from 'axios';

const getErrorMessage = (err: unknown): string => {
  if (err instanceof AxiosError) {
    const data = err.response?.data as { message?: string };
    return data?.message || err.message || 'Failed to send offer';
  }
  if (err instanceof Error) return err.message;
  return 'Failed to send offer';
};

// استخدام `useSendOffer` لإرسال العرض
export const useSendOffer = (jobPostingId?: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOfferData) => {
      if (!jobPostingId) {
        throw new Error('Job posting ID is required');
      }
      return OfferService.create(jobPostingId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interviews'] });
      queryClient.invalidateQueries({ queryKey: ['offers'] });
      toast.success('🎉 Offer sent successfully!');
    },
    onError: (err) => {
      toast.error(getErrorMessage(err));
    },
  });
};

// إضافة `useOffers` لجلب كل العروض
export const useOffers = (jobPostingId?: number) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['offers', jobPostingId],
    queryFn: async () => {
      if (!jobPostingId) return [];
      const res = await OfferService.getAllByJobPosting(jobPostingId);
      return res.data?.data || [];
    },
    enabled: !!jobPostingId,
  });

  return {
    offers: data || [],
    isLoading,
    error: error?.message || null,
    refetch,
  };
};