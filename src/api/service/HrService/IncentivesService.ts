// src/api/service/HrService/IncentivesService.ts
import { apiClient } from '../../client';
import type { IncentiveRecord } from './Types/payroll.types';

export const IncentivesService = {
  // ✅ تصحيح المسار (أضفنا s في النهاية)
  getAll: () => apiClient.get<{ data: IncentiveRecord[] }>('/incentives'),
  
  create: (data: { user_id: number; amount: number; reason: string; date: string }) =>
    apiClient.post('/incentives', data),
};