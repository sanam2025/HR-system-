// src/core/modules/HR/hooks/useResignations.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ResignationsService } from '../../../../api/service/HrService/ResignationsService';
import { AxiosError } from 'axios';
import type { Resignation } from '../types/ResignationsService.types';
//  إضافة استيراد النوع

export const useResignations = (type?: 'with_notice' | 'immediate') => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['resignations', type],
    queryFn: async () => {
      const res = await ResignationsService.getAll(type);
      return res.data?.data || res.data || [];
    },
  });
  return { resignations: data as Resignation[], isLoading, error: error?.message, refetch };
};

export const useResignationDetails = (id: number) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['resignation', id],
    queryFn: async () => {
      const res = await ResignationsService.getById(id);
      return res.data?.data || res.data || null;
    },
    enabled: !!id,
  });
  return { resignation: data as Resignation | null, isLoading, error: error?.message, refetch };
};

export const useClassifyResignation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: { hr_classification: 'mutual_consent' | 'breach_by_company' | 'breach_by_employee'; hr_classification_notes: string } }) =>
      ResignationsService.classify(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resignations'] });
      toast.success(' Resignation classified successfully!');
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        const msg = err.response?.data as { message?: string };
        toast.error(msg?.message || 'Failed to classify resignation');
      }
    },
  });
};

export const useDownloadResignationDocument = () => {
  return useMutation({
    mutationFn: async ({ resignationId, documentId }: { resignationId: number; documentId: number }) => {
      const res = await ResignationsService.downloadDocument(resignationId, documentId);
      return res.data as Blob;
    },
    onSuccess: (data: Blob) => {
      const url = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'resignation_document.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success(' Document downloaded successfully!');
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        const msg = err.response?.data as { message?: string };
        toast.error(msg?.message || 'Failed to download document');
      }
    },
  });
};