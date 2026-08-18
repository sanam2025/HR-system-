// src/core/modules/HR/hooks/useProfile.ts
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../../api/client';

// ✅ جلب بيانات الموظف الحالي
export const useProfile = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await apiClient.get('/profiles');
      return response.data?.data || null;
    },
  });

  return {
    profile: data,
    isLoading,
    error: error?.message || null,
    refetch,
  };
};

// ✅ جلب بيانات موظف معين (إذا كنت تحتاج ID)
export const useEmployeeProfile = (id: number) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['employeeProfile', id],
    queryFn: async () => {
      const response = await apiClient.get(`/profiles/${id}`);
      return response.data?.data || null;
    },
    enabled: !!id,
  });

  return {
    profile: data,
    isLoading,
    error: error?.message || null,
    refetch,
  };
};