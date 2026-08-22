import { apiClient } from '../../client';

export const EmployeesService = {  getEmployees: () => apiClient.get('/users/employees'),  getManagers: () => apiClient.get('/users/managers'),  getCount: () => apiClient.get('/users/count'),  getDepartmentEmployees: (id: number) => apiClient.get(`/department/${id}/employees`),  getDepartmentUsers: () => apiClient.get('/department/users'),  searchEmployees: (query: string) => apiClient.get(`/search-employees?search=${query}`),  getManagerEmployees: () => apiClient.get('/manager-employees'),
};