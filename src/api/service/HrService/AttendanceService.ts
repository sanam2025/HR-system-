// src/api/service/HrService/AttendanceService.ts
import { apiClient } from '../../client';

export interface AttendanceRecord {
  id: number;
  employee_name: string;
  employee_id: number;
  check_in?: string;
  check_out?: string;
  status: 'present' | 'absent' | 'late' | 'leave';
  department: string;
}

export interface AttendanceStats {
  total: number;
  present: number;
  absent: number;
  late: number;
}

export const AttendanceService = {
  // ✅ جلب حضور اليوم
  getToday: () => apiClient.get<{ data: AttendanceRecord[] }>('/attendance-today'),

  // ✅ جلب تحليل الحضور
  getAnalysis: () => apiClient.get<{ data: AttendanceStats }>('/attendance-today-analysis'),

  // ✅ جلب الحضور المفلتر
  getFiltered: (from: string, to: string) =>
    apiClient.get<{ data: AttendanceRecord[] }>(`/attendance-filter?from=${from}&to=${to}`),
};