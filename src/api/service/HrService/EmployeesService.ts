// src/api/service/HrService/EmployeesService.ts
import { apiClient } from '../../client';

export const EmployeesService = {
  // جلب كل الموظفين
  getEmployees: () => apiClient.get('/users/employees'),
  // جلب كل المديرين
  getManagers: () => apiClient.get('/users/managers'),
  // جلب عدد الموظفين والمديرين
  getCount: () => apiClient.get('/users/count'),
  // جلب موظفي قسم معين
  getDepartmentEmployees: (id: number) => apiClient.get(`/department/${id}/employees`),
  // جلب كل المستخدمين في قسم
  getDepartmentUsers: () => apiClient.get('/department/users'),
  // بحث عن موظف
  searchEmployees: (query: string) => apiClient.get(`/search-employees?search=${query}`),
  // جلب موظفي المدير
  getManagerEmployees: () => apiClient.get('/manager-employees'),
};