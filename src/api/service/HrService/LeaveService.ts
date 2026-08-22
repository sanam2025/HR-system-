import { apiClient } from '../../client';

export interface LeaveRequest {
  id: number;
  employee_name: string;
  employee_id: number;
  start_date: string;
  end_date?: string;
  days_count: number;
  type: 'annual' | 'sick' | 'emergency' | 'unpaid';
  status: 'pending' | 'approved' | 'rejected';
  reason?: string;
  department: string;
}

export interface LeaveBalance {
  annual: number;
  sick: number;
  emergency: number;
  unpaid: number;
}

export const LeaveService = {  getAll: () => apiClient.get<{ data: LeaveRequest[] }>('/leaveRequests'),  getById: (id: number) => apiClient.get<{ data: LeaveRequest }>(`/leaveRequests/${id}`),  approve: (id: number) => apiClient.put(`/leave-requests/${id}/approve`),  reject: (id: number) => apiClient.put(`/leave-requests/${id}/reject`),  getBalance: (employeeId: number) =>
    apiClient.get<{ data: LeaveBalance }>(`/employee-leave/${employeeId}/balance`),  getDepartmentRequests: (status?: string) =>
    apiClient.get<{ data: LeaveRequest[] }>(
      `/department-leave-request${status ? `?status=${status}` : ''}`
    ),  getAllRequests: (from?: string, to?: string) => {
    let url = '/all-leave-request';
    const params = new URLSearchParams();
    if (from) params.append('from', from);
    if (to) params.append('to', to);
    if (params.toString()) url += `?${params.toString()}`;
    return apiClient.get<{ data: LeaveRequest[] }>(url);
  },
};