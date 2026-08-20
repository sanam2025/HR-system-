// src/core/modules/HR/hooks/useEmployees.ts
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../../api/client';
import type { Employee } from '../../../../api/service/HrService/Types/DepartmentsService.types';

//  جلب موظف واحد
export const useEmployee = (userId?: number) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['employee', userId],
    queryFn: async () => {
      if (!userId) return null;
      const res = await apiClient.get<{ data: Employee }>(`/users/${userId}`);
      return res.data?.data || null;
    },
    enabled: !!userId,
  });

  return {
    employee: data,
    isLoading,
    error: error?.message || null,
    refetch,
  };
};