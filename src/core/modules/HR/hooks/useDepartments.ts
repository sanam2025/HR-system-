// src/core/modules/HR/hooks/useDepartments.ts
import { useQuery } from '@tanstack/react-query';
import { DepartmentsService } from '../../../../api/service/HrService/DepartmentsService';

//  جلب الأقسام مع الموظفين
export const useDepartmentsWithUsers = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['departments', 'withUsers'],
    queryFn: async () => {
      const res = await DepartmentsService.getDepartmentsWithUsers();
      return res.data?.data || [];
    },
  });

  return {
    departments: data || [],
    isLoading,
    error: error?.message || null,
    refetch,
  };
};

//  جلب كل الأقسام
export const useDepartments = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const res = await DepartmentsService.getAllNames();
      return res.data?.data || [];
    },
  });

  return {
    departments: data || [],
    isLoading,
    error: error?.message || null,
    refetch,
  };
};

//  جلب قسم معين مع موظفيه (جديد)
export const useDepartmentEmployees = (id: number) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['department', id, 'employees'],
    queryFn: async () => {
      const res = await DepartmentsService.getByIdWithUsers(id);
      return res.data?.data || null;
    },
    enabled: !!id,
  });

  return {
    department: data,
    isLoading,
    error: error?.message || null,
    refetch,
  };
};