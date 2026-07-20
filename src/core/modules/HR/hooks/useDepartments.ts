// src/core/modules/HR/hooks/useDepartments.ts
import { useQuery } from '@tanstack/react-query';
import { DepartmentsService } from '../../../../api/service/HrService/DepartmentsService';

// ✅ جلب كل الأقسام مع الموظفين
export const useDepartmentsWithUsers = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['departments-with-users'],
    queryFn: async () => {
      const res = await DepartmentsService.getAllWithUsers();
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

// ✅ جلب موظفي قسم معين
export const useDepartmentEmployees = (departmentId?: number) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['department-employees', departmentId],
    queryFn: async () => {
      if (!departmentId) return [];
      const res = await DepartmentsService.getDepartmentEmployees(departmentId);
      return res.data?.data || [];
    },
    enabled: !!departmentId,
  });

  return {
    employees: data || [],
    isLoading,
    error: error?.message || null,
    refetch,
  };
};

// ✅ جلب بروفايل موظف
export const useProfile = (userId?: number) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      if (!userId) return null;
      const res = await DepartmentsService.getProfile(userId);
      return res.data?.data || null;
    },
    enabled: !!userId,
  });

  return {
    profile: data,
    isLoading,
    error: error?.message || null,
    refetch,
  };
};

// ✅ جلب موظفي المدير
export const useManagerEmployees = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['manager-employees'],
    queryFn: async () => {
      const res = await DepartmentsService.getManagerEmployees();
      return res.data?.data || [];
    },
  });

  return {
    employees: data || [],
    isLoading,
    error: error?.message || null,
    refetch,
  };
};