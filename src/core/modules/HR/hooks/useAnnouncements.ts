// src/core/modules/HR/hooks/useAnnouncements.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { AnnouncementsService } from '../../../../api/service/HrService/AnnouncementsService';
import type { CreateAnnouncementData, UpdateAnnouncementData } from '../../../../api/service/HrService/Types/AnnouncementsService.types';
import { AxiosError } from 'axios';

// ✅ جلب التعميمات النشطة (استخدام /announcements/active كما في الـ Collection)
export const useActiveAnnouncements = (params: Record<string, unknown> = {}) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['announcements', 'active', params],
    queryFn: async () => {
      const response = await AnnouncementsService.getActive(params);
      return response.data?.data || [];
    },
  });

  return {
    announcements: data || [],
    isLoading,
    error: error?.message || null,
    refetch,
  };
};

// ✅ إنشاء تعميم جديد
export const useCreateAnnouncement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAnnouncementData) => 
      AnnouncementsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      toast.success('✅ Announcement created successfully!');
    },
    onError: (err: unknown) => {
      if (err instanceof AxiosError && err.response?.status === 422) {
        const data = err.response.data as Record<string, string[]>;
        const firstKey = Object.keys(data)[0];
        const msg = data[firstKey]?.[0];
        toast.error(`❌ ${msg || 'Validation error'}`);
      } else {
        toast.error('❌ Failed to create announcement');
      }
    },
  });
};

// ✅ تحديث تعميم (جديد)
export const useUpdateAnnouncement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateAnnouncementData }) =>
      AnnouncementsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      toast.success('✅ Announcement updated successfully!');
    },
    onError: (err: unknown) => {
      if (err instanceof AxiosError && err.response?.status === 422) {
        const data = err.response.data as Record<string, string[]>;
        const firstKey = Object.keys(data)[0];
        const msg = data[firstKey]?.[0];
        toast.error(`❌ ${msg || 'Validation error'}`);
      } else {
        toast.error('❌ Failed to update announcement');
      }
    },
  });
};

// ✅ حذف تعميم
export const useDeleteAnnouncement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => AnnouncementsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      toast.success('🗑️ Announcement deleted successfully!');
    },
    onError: (err: unknown) => {
      if (err instanceof AxiosError) {
        const data = err.response?.data as { message?: string };
        toast.error(data?.message || 'Failed to delete announcement');
      } else {
        toast.error('Failed to delete announcement');
      }
    },
  });
};

// ✅ جلب كل التعميمات (للمسؤول، إذا احتجتها لاحقاً)
export const useAnnouncements = (params: Record<string, unknown> = {}) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['announcements', params],
    queryFn: async () => {
      const response = await AnnouncementsService.getAll(params);
      return response.data?.data || [];
    },
  });

  return {
    announcements: data || [],
    isLoading,
    error: error?.message || null,
    refetch,
  };
};

// ✅ نشر تعميم فوراً
export const usePublishAnnouncement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => AnnouncementsService.publishNow(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      toast.success('✅ Announcement published successfully!');
    },
    onError: (err: unknown) => {
      if (err instanceof AxiosError) {
        const data = err.response?.data as { message?: string };
        toast.error(data?.message || 'Failed to publish announcement');
      } else {
        toast.error('Failed to publish announcement');
      }
    },
  });
};