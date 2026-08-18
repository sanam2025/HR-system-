// src/api/service/HrService/PayrollsService.ts
import { apiClient } from '../../client';

export const PayrollsService = {
  // جلب كشف رواتب الشهر الحالي
  getCurrentPayroll: () => apiClient.get('/payroll/current'),
  // جلب كل كشوف الرواتب
  getAllPayrolls: () => apiClient.get('/payrolls'),
  // إنشاء كشف راتب جديد
  generatePayroll: () => apiClient.post('/payroll/generate'),
};