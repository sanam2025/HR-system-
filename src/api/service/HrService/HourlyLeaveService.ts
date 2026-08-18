// src/api/service/HrService/HourlyLeaveService.ts
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

export const HourlyLeaveService = {
  // ✅ جلب كل الطلبات
  getAll: () => apiClient.get<{ data: HourlyLeaveRequest[] }>('/hourly-leave-Requests'),

  // ✅ جلب تفاصيل طلب
  getById: (id: number) => apiClient.get<{ data: HourlyLeaveRequest }>(`/hourly-leave-Requests/${id}`),

  // ✅ موافقة على طلب
  approve: (id: number) => apiClient.put(`/hourly-leave-requests/${id}/approve`),

  // ✅ رفض طلب
  reject: (id: number) => apiClient.put(`/hourly-leave-requests/${id}/reject`),

  // ✅ طلبات قسم معين
  getDepartmentRequests: (status?: string) =>
    apiClient.get<{ data: HourlyLeaveRequest[] }>(
      `/department-hourly-leave-request${status ? `?status=${status}` : ''}`
    ),

  // ✅ كل طلبات القسم
  getAllDepartmentRequests: (depId?: number) => {
    let url = '/all-hourly-leave-request';
    if (depId) url += `?dep_id=${depId}`;
    return apiClient.get<{ data: HourlyLeaveRequest[] }>(url);
  },
};