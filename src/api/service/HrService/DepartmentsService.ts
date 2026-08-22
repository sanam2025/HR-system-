import { apiClient } from '../../client';

export const DepartmentsService = {  getCount: () => apiClient.get('/departments/count'),  getAllNames: () => apiClient.get('/departments/names'),  getAllDetails: () => apiClient.get('/departments/all'),  getDepartmentEmployees: (id: number) => apiClient.get(`/departments/${id}/employees`),  getAllWithEmployees: () => apiClient.get('/departments/employees'),
   getDepartmentsWithUsers: () => apiClient.get('/departments/employees'),
};