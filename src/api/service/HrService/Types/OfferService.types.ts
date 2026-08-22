export interface CreateOfferData {
  candidate_id: number;
  hour_price: number;
  start_date: string;
  weekend_days: string[];
  working_hour_per_day: number;
}

export interface Offer {
  id: number;
  candidate_id: number;
  job_posting_id: number;
  hour_price: number;
  start_date: string;
  end_date?: string;
  weekend_days: string[];
  working_hour_per_day: number;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  created_at: string;
  updated_at: string;
  candidate?: {
    id: number;
    full_name: string;
    email: string;
  };
}

export interface OfferResponse {
  data: Offer;
  message?: string;
}