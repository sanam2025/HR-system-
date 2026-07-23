// src/api/service/HrService/OfferService.ts
import { apiClient } from '../../client';
import type { CreateOfferData, Offer, OfferResponse } from './Types/OfferService.types';

export const OfferService = {
  // ✅ إرسال عرض
  create: (jobPostingId: number, data: CreateOfferData) =>
    apiClient.post<OfferResponse>(`/job-postings/${jobPostingId}/offers`, data),

  // ✅ جلب كل العروض لوظيفة معينة
  getAllByJobPosting: (jobPostingId: number) =>
    apiClient.get<{ data: Offer[] }>(`/job-postings/${jobPostingId}/offers`),
};