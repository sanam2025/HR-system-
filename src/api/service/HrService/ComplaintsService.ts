// src/api/service/HrService/ComplaintsService.ts
import { apiClient } from '../../client';
import type {
  Complaint,
  CreateComplaintData,
  UpdateComplaintStatusData,
  RespondComplaintData,
} from './Types/ComplaintsService.types';

export const ComplaintsService = {
  // ✅ Get all complaints (HR only)
  getAll: () => apiClient.get<{ data: Complaint[] }>('/complaints'),

  // ✅ Get single complaint
  getById: (id: number) => apiClient.get<{ data: Complaint }>(`/complaints/${id}`),

  // ✅ Create new complaint (Employee)
  create: (data: CreateComplaintData) => apiClient.post<{ data: Complaint }>('/complaints', data),

  // ✅ Start review (HR)
  markUnderReview: (id: number) => apiClient.patch<{ data: Complaint }>(`/complaints/${id}/mark-under-review`),

  // ✅ Respond to complaint (HR)
  respond: (id: number, data: RespondComplaintData) => 
    apiClient.post<{ data: Complaint }>(`/complaints/${id}/respond`, data),

  // ✅ Update complaint status
  updateStatus: (id: number, data: UpdateComplaintStatusData) =>
    apiClient.patch<{ data: Complaint }>(`/complaints/${id}/status`, data),
};