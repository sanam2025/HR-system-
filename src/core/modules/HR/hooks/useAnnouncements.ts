// src/core/modules/HR/hooks/useAnnouncements.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { AnnouncementsService } from '../../../../api/service/HrService/AnnouncementsService';
import type {
  CreateAnnouncementData,
  UpdateAnnouncementData,
} from '../../../../api/service/HrService/Types/AnnouncementsService.types';

// جلب جميع التعميمات
export const useAnnouncements = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['announcements'],
    queryFn: async () => {
      const res = await AnnouncementsService.getAll();
      return res.data?.data || [];
    },
  });

  return {
    announcements: data || [],
    isLoading,
    error: error?.message || null,
    refetch,
  };
};

// جلب التعميمات النشطة
export const useActiveAnnouncements = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['announcements-active'],
    queryFn: async () => {
      const res = await AnnouncementsService.getActive();
      return res.data?.data || [];
    },
    refetchInterval: 60000,
  });

  return {
    announcements: data || [],
    isLoading,
    error: error?.message || null,
    refetch,
  };
};

// جلب تعميم واحد
export const useAnnouncement = (id?: number) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['announcement', id],
    queryFn: async () => {
      if (!id) return null;
      const res = await AnnouncementsService.getById(id);
      return res.data?.data || null;
    },
    enabled: !!id,
  });

  return {
    announcement: data,
    isLoading,
    error: error?.message || null,
    refetch,
  };
};

// إنشاء تعميم
export const useCreateAnnouncement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAnnouncementData) => AnnouncementsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      queryClient.invalidateQueries({ queryKey: ['announcements-active'] });
      toast.success('تم إنشاء التعميم بنجاح');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'فشل إنشاء التعميم');
    },
  });
};

// تحديث تعميم
export const useUpdateAnnouncement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateAnnouncementData }) =>
      AnnouncementsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      queryClient.invalidateQueries({ queryKey: ['announcements-active'] });
      toast.success('تم تحديث التعميم بنجاح');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'فشل تحديث التعميم');
    },
  });
};

// حذف تعميم
export const useDeleteAnnouncement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => AnnouncementsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      queryClient.invalidateQueries({ queryKey: ['announcements-active'] });
      toast.success('تم حذف التعميم بنجاح');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'فشل حذف التعميم');
    },
  });
};

// نشر فوري
export const usePublishAnnouncement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => AnnouncementsService.publishNow(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      queryClient.invalidateQueries({ queryKey: ['announcements-active'] });
      toast.success('تم النشر الفوري للتعميم');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'فشل النشر الفوري');
    },
  });
};