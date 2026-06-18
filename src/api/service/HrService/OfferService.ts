// src/api/service/HrService/OfferService.ts
import { apiClient } from '../../client';

export interface Offer {
  id: number;
  candidate_id: number;
  candidate_name: string;
  job_posting_id: number;
  job_title: string;
  hour_price: number;
  start_date: string;
  weekend_days: string[];
  working_hour_per_day: number;
  status: 'pending' | 'accepted' | 'rejected';
  created_at?: string;
}

export interface SendOfferData {
  candidate_id: number;
  hour_price: number;
  start_date: string;
  weekend_days: string[];
  working_hour_per_day: number;
}

export const OfferService = {
  // ✅ جلب قائمة العروض لوظيفة
  getByJobId: (jobId: number) =>
    apiClient.get<{ data: Offer[] }>(`/job-postings/${jobId}/offers`),

  // ✅ إرسال عرض وظيفي
  send: (jobId: number, data: SendOfferData) =>
    apiClient.post<{ data: Offer }>(`/job-postings/${jobId}/offers`, data),
};