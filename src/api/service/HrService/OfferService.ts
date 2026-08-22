import { apiClient } from '../../client';
import type { CreateOfferData, Offer, OfferResponse } from './Types/OfferService.types';

export const OfferService = {  create: (jobPostingId: number, data: CreateOfferData) => {    console.log('🚀 Sending to Backend:', data);

    return apiClient.post<OfferResponse>(`/job-postings/${jobPostingId}/offers`, data);
  },  getAllByJobPosting: (jobPostingId: number) =>
    apiClient.get<{ data: Offer[] }>(`/job-postings/${jobPostingId}/offers`),
};