// src/api/service/HrService/PayrollsService.ts
import { apiClient } from '../../client';

export const PayrollsService = {
  // جلب كشف رواتب الشهر الحالي (يحتاج صلاحية عالية)
  getCurrentPayroll: () => apiClient.get('/payroll/current'),
  // جلب كل كشوف الرواتب
  getAllPayrolls: () => apiClient.get('/payrolls'),
  // جلب رواتب الشهر الحالي (Payslips — متاح لـ HR)
  getCurrentMonthPayslips: () => apiClient.get('/current-month-payslips'),
  // ملخص الرواتب
  getPayslipsSummary: () => apiClient.get('/summary-payslips'),
  // إنشاء كشف راتب جديد
  generatePayroll: () => apiClient.post('/payroll/generate'),
};