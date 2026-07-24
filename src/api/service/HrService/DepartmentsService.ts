// src/api/service/HrService/DepartmentsService.ts
import apiClient from '@/api/axios';
import type {  DepartmentWithEmployees, Employee, Profile } from './Types/DepartmentsService.types';

export const DepartmentsService = {
  // جلب كل الأقسام مع الموظفين والمدراء
  getAllWithUsers: () => apiClient.get<{ data: DepartmentWithEmployees[] }>('/department/users'),

  // جلب موظفي قسم معين
  getDepartmentEmployees: (departmentId: number) => 
    apiClient.get<{ data: Employee[] }>(`/department/${departmentId}/employees`),

  // جلب بروفايل موظف
  getProfile: (userId: number) => 
    apiClient.get<{ data: Profile }>(`/profiles/${userId}`),

  // جلب بروفايل المستخدم الحالي
  getMyProfile: () => 
    apiClient.get<{ data: Profile }>('/profiles'),

  // جلب موظفي المدير
  getManagerEmployees: () => 
    apiClient.get<{ data: Employee[] }>('/manager-employees'),
};