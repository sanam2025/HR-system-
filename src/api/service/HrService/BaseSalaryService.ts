// src/api/service/HrService/BaseSalaryService.ts
import { apiClient } from '../../client';

export const BaseSalaryService = {
  // جلب رواتب الموظف الحالي
  getMyBaseSalaries: () => apiClient.get('/my-base-salaries'),
  // جلب رواتب موظف معين
  getEmployeeSalaries: (id: number) => apiClient.get(`/base/${id}/employee-salaries`),
  // زيادة سعر الساعة لموظف (POST)
  increaseHourPrice: (id: number, data: { hour_price: number; reason: string }) =>
    apiClient.post(`/increase/${id}/employee-hour-price`, data),
};