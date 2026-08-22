import { apiClient } from '../../client';

export interface HourlyLeaveRequest {
  id: number;
  employee_name: string;
  employee_id: number;
  date: string;
  start_time: string;
  end_time: string;
  hours: number;
  reason?: string;
  status: 'pending' | 'approved' | 'rejected';
  department: string;
}

export const HourlyLeaveService = {  getAll: () => apiClient.get<{ data: HourlyLeaveRequest[] }>('/hourly-leave-Requests'),  getById: (id: number) => apiClient.get<{ data: HourlyLeaveRequest }>(`/hourly-leave-Requests/${id}`),  approve: (id: number) => apiClient.put(`/hourly-leave-requests/${id}/approve`),  reject: (id: number) => apiClient.put(`/hourly-leave-requests/${id}/reject`),  getDepartmentRequests: (status?: string) =>
    apiClient.get<{ data: HourlyLeaveRequest[] }>(
      `/department-hourly-leave-request${status ? `?status=${status}` : ''}`
    ),  getAllDepartmentRequests: (depId?: number) => {
    let url = '/all-hourly-leave-requests-hr';
    if (depId) url += `?dep_id=${depId}`;
    return apiClient.get<{ data: HourlyLeaveRequest[] }>(url);
  },
};