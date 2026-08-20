// src/core/modules/HR/hooks/useProfile.ts
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../../api/client';
import { useAuthStore } from '../../../../store/authStore';

//  جلب بيانات المستخدم الحالي (مرتبط بالـ ID من authStore)
export const useProfile = () => {
  const currentUser = useAuthStore(state => state.currentUser);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['profile', currentUser?.id],
    queryFn: async () => {
      if (!currentUser?.id) return null;
      try {
        // أولاً: محاولة جلب بروفايل المستخدم الحالي بـ ID
        const response = await apiClient.get(`/profiles/${currentUser.id}`);
        return response.data?.data || response.data || null;
      } catch {
        // ثانياً: fallback — جلب القائمة والبحث عن المستخدم
        const listRes = await apiClient.get('/profiles');
        const list = listRes.data?.data || listRes.data;
        if (Array.isArray(list)) {
          // البحث عن بروفايل المستخدم الحالي
          return list.find((p: any) =>
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
};

//  جلب بيانات موظف معين (إذا كنت تحتاج ID)
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