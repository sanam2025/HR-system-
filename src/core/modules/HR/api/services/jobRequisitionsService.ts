// core/modules/HR/api/services/jobRequisitionsService.ts
import apiClient from '../client';

export interface JobRequisition {
  id: number;
  job_title: string;
  description?: string;
  experience: number;
  status: 'pending' | 'approved' | 'rejected' | null;
  created_at: string;
  department: { id: number; name: string; };
  requested_by: { id: number; full_name: string; };
  skills_count: number;
  is_posted: boolean;
}

export interface CreateJobRequisitionData {
  job_title: string;
  description: string;
  experience: number;
  skills: number[];
}

export const jobRequisitionsService = {
  // 1. GET all
  getAll: async (): Promise<JobRequisition[]> => {
    const response = await apiClient.get('/job-requisitions');
    return response.data?.data || [];
  },

  // 2. GET all (نسخة HR)
  getAllForHR: async (): Promise<JobRequisition[]> => {
    const response = await apiClient.get('/job-requisitions/all');
    return response.data?.data || [];
  },

  // 3. GET by id
  getById: async (id: number): Promise<JobRequisition> => {
    const response = await apiClient.get(`/job-requisitions/${id}`);
    return response.data?.data;
  },

  // 4. POST create
  create: async (data: CreateJobRequisitionData): Promise<JobRequisition> => {
    const response = await apiClient.post('/job-requisitions', data);
    return response.data?.data;
  },

  // 5. PATCH update
  update: async (id: number, data: Partial<CreateJobRequisitionData>): Promise<JobRequisition> => {
    const response = await apiClient.patch(`/job-requisitions/${id}`, data);
    return response.data?.data;
  },

  // 6. DELETE
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/job-requisitions/${id}`);
  },

  // 7. Approve (قد لا يعمل)
  approve: async (id: number): Promise<JobRequisition> => {
    const response = await apiClient.post(`/job-requisitions/${id}/approve`);
    return response.data?.data;
  },

  // 8. Reject (قد لا يعمل)
  reject: async (id: number): Promise<JobRequisition> => {
    const response = await apiClient.post(`/job-requisitions/${id}/reject`);
    return response.data?.data;
  },

  // 9. Prefill
  getPrefill: async (id: number): Promise<Partial<JobRequisition>> => {
    const response = await apiClient.get(`/job-requisitions/${id}/prefill`);
    return response.data?.data;
  },
};