import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../../api/client';
import { useAuthStore } from '../../../../store/authStore';export const useProfile = () => {
  const currentUser = useAuthStore(state => state.currentUser);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['profile', currentUser?.id],
    queryFn: async () => {
      if (!currentUser?.id) return null;
      try {        const response = await apiClient.get(`/profiles/${currentUser.id}`);
        return response.data?.data || response.data || null;
      } catch {        const listRes = await apiClient.get('/profiles');
        const list = listRes.data?.data || listRes.data;
        if (Array.isArray(list)) {          return list.find((p: any) =>
            p.user_id === currentUser.id ||
            p.user?.id === currentUser.id ||
            p.id === currentUser.id
          ) || list[0] || null;
        }
        return list || null;
      }
    },
    enabled: !!currentUser?.id,
  });

  return {
    profile: data,
    isLoading,
    error: error?.message || null,
    refetch,
  };
};export const useEmployeeProfile = (id: number) => {
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