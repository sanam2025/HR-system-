// src/api/service/HrService/DepartmentsService.ts
import { apiClient } from '../../client';

export const DepartmentsService = {
  // ✅ جرب هذا أولاً (حسب الـ Collection)
  getDepartmentsWithUsers: () => 
    apiClient.get('/department/users'),

  // ✅ جرب هذا إذا لم يعمل الأول
  // getDepartmentsWithUsers: () => 
  //   apiClient.get('/department/users'),

  // ✅ جلب كل الأقسام
  getAll: () => apiClient.get('/departments'),

  // ✅ جلب قسم معين مع موظفيه
  getByIdWithUsers: (id: number) => 
    apiClient.get(`/departments/${id}/employees`),

  // ✅ جلب كل المستخدمين (موظفين ومديرين)
  getUsers: () => apiClient.get('/department/users'),

  // ✅ جلب جميع الموظفين
  getEmployees: () => apiClient.get('/users/employees'),
};