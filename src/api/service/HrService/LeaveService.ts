// src/api/service/HrService/LeaveService.ts
import apiClient from '@/api/axios';

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

export const LeaveService = {
  // جلب كل الطلبات
  getAll: () => apiClient.get<{ data: LeaveRequest[] }>('/leaveRequests'),

  // جلب تفاصيل طلب
  getById: (id: number) => apiClient.get<{ data: LeaveRequest }>(`/leaveRequests/${id}`),

  // موافقة على طلب
  approve: (id: number) => apiClient.put(`/leave-requests/${id}/approve`),

  // رفض طلب
  reject: (id: number) => apiClient.put(`/leave-requests/${id}/reject`),

  // رصيد إجازات موظف
  getBalance: (employeeId: number) =>
    apiClient.get<{ data: LeaveBalance }>(`/employee-leave/${employeeId}/balance`),

  // طلبات قسم معين
  getDepartmentRequests: (status?: string) =>
    apiClient.get<{ data: LeaveRequest[] }>(
      `/department-leave-request${status ? `?status=${status}` : ''}`
    ),

  // كل طلبات الإجازات (مع فلترة)
  getAllRequests: (from?: string, to?: string) => {
    let url = '/all-leave-request';
    const params = new URLSearchParams();
    if (from) params.append('from', from);
    if (to) params.append('to', to);
    if (params.toString()) url += `?${params.toString()}`;
    return apiClient.get<{ data: LeaveRequest[] }>(url);
  },
};