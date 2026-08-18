import { apiClient } from '../../client';
import type { CreateOfferData, Offer, OfferResponse } from './Types/OfferService.types';

export const OfferService = {
  // ✅ إرسال عرض (مع طباعة البيانات للتصحيح)
  create: (jobPostingId: number, data: CreateOfferData) => {
    // طباعة البيانات المرسلة للباك إند في الـ Console (F12)
    console.log('🚀 Sending to Backend:', data);

    return apiClient.post<OfferResponse>(`/job-postings/${jobPostingId}/offers`, data);
  },

  // ✅ جلب كل العروض لوظيفة معينة
  getAllByJobPosting: (jobPostingId: number) =>
    apiClient.get<{ data: Offer[] }>(`/job-postings/${jobPostingId}/offers`),
};