import { apiClient } from '../../client';
import type {
  Complaint,
  CreateComplaintData,
  UpdateComplaintStatusData,
  RespondComplaintData,
} from './Types/ComplaintsService.types';

export const ComplaintsService = {  getAll: () => apiClient.get<{ data: Complaint[] }>('/complaints'),  getById: (id: number) => apiClient.get<{ data: Complaint }>(`/complaints/${id}`),  create: (data: CreateComplaintData) => apiClient.post<{ data: Complaint }>('/complaints', data),  markUnderReview: (id: number) => apiClient.patch<{ data: Complaint }>(`/complaints/${id}/mark-under-review`),  respond: (id: number, data: RespondComplaintData) => 
    apiClient.post<{ data: Complaint }>(`/complaints/${id}/respond`, data),  updateStatus: (id: number, data: UpdateComplaintStatusData) =>
    apiClient.patch<{ data: Complaint }>(`/complaints/${id}/status`, data),
};