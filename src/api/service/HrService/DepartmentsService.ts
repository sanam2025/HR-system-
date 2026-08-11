// src/api/service/HrService/DepartmentsService.ts
import { apiClient } from '../../client';

export const DepartmentsService = {
  // ✅ جلب عدد الأقسام (بناءً على الصورة الأولى: count department)
  getCount: () => apiClient.get('/departments/count'),

  // ✅ جلب أسماء الأقسام فقط (للعرض ككروت)
  getAllNames: () => apiClient.get('/departments/names'),

  // ✅ جلب تفاصيل كل الأقسام (الاسم، المدير، عدد الموظفين)
  getAllDetails: () => apiClient.get('/departments/all'),

  // ✅ جلب موظفي قسم معين (للضغط على الكارد والذهاب للتفاصيل)
  getDepartmentEmployees: (id: number) => apiClient.get(`/departments/${id}/employees`),

  // ✅ جلب جميع الموظفين مع أقسامهم دفعة واحدة
  getAllWithEmployees: () => apiClient.get('/departments/employees'),
};