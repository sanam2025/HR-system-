// src/api/service/HrService/DeductionsService.ts
import { apiClient } from '../../client';
import type { DeductionRecord } from './Types/payroll.types';

export const DeductionsService = {
  // ✅ جرب هذا المسار إذا كان الباك إند يتوقعه
  getAll: () => apiClient.get<{ data: DeductionRecord[] }>('/my-deductions'),
  
  // ✅ أو جرب هذا إذا كان يتوقع POST
  // getAll: () => apiClient.post<{ data: DeductionRecord[] }>('/deductions'),

  create: (data: { user_id: number; amount: number; reason: string; date: string }) =>
    apiClient.post('/deductions', data),
};