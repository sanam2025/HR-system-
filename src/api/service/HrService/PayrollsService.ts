import { apiClient } from '../../client';

export const PayrollsService = {  getCurrentPayroll: () => apiClient.get('/payroll/current'),  getAllPayrolls: () => apiClient.get('/payrolls'),  getCurrentMonthPayslips: () => apiClient.get('/current-month-payslips'),  getPayslipsSummary: () => apiClient.get('/summary-payslips'),  generatePayroll: () => apiClient.post('/payroll/generate'),
};