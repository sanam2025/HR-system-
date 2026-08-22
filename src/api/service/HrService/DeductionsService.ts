import { apiClient } from '../../client';
import type { DeductionRecord } from './Types/payroll.types';

export const DeductionsService = {

  getAll: () => apiClient.get<{ data: DeductionRecord[] }>('/deductions'),

  create: (data: { user_id: number; amount: number; reason: string; date: string }) =>
    apiClient.post('/deductions', data),
};