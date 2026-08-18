// src/api/service/HrService/ContractsService.ts
import { apiClient } from '../../client';

export const ContractsService = {
  // 1. جلب كل العقود
  getAll: () => apiClient.get('/allcontracts'), // المسار سيتم تعديله حسب الكوليكشن الخاصة بك

  // 2. جلب العقود التي ستنتهي قريباً
  getExpiringSoon: () => apiClient.get('/contracts/expiring-soon'),

  // 3. عرض تفاصيل عقد محدد
  getById: (id: number) => apiClient.get(`/employees/${id}/contract`),

  // 4. تنزيل العقد بصيغة PDF
  downloadContract: (id: number) => apiClient.get(`/employees/${id}/contract/download`, {
    responseType: 'blob',
  }),

  // 5. تجديد العقد
  renewContract: (id: number, data: { new_start_date: string; new_end_date: string; new_hour_price: number }) =>
    apiClient.post(`/contracts/${id}/renewals`, data),

  // 6. عدم التجديد
  nonRenewContract: (id: number) => apiClient.patch(`/contracts/${id}/non-renewable`),
};