// src/core/modules/HR/hooks/useContracts.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ContractsService } from '../../../../api/service/HrService/ContractsService';
import { AxiosError } from 'axios';

// 1. جلب كل العقود
export const useContracts = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['contracts'],
    queryFn: async () => {
      const res = await ContractsService.getAll();
      return res.data?.data || [];
    },
  });
  return { contracts: data || [], isLoading, error: error?.message, refetch };
};

// 2. جلب العقود المنتهية قريباً
export const useContractsExpiringSoon = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['contracts-expiring-soon'],
    queryFn: async () => {
      const res = await ContractsService.getExpiringSoon();
      return res.data?.data || [];
    },
  });
  return { contracts: data || [], isLoading, error: error?.message, refetch };
};

// 3. جلب عقد معين
export const useContract = (id: number) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['contract', id],
    queryFn: async () => {
      const res = await ContractsService.getById(id);
      return res.data?.data || null;
    },
    enabled: !!id,
  });
  return { contract: data, isLoading, error: error?.message, refetch };
};

// 4. تجديد العقد
export const useRenewContract = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: { new_start_date: string; new_end_date: string; new_hour_price: number } }) =>
      ContractsService.renewContract(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      queryClient.invalidateQueries({ queryKey: ['contracts-expiring-soon'] });
      toast.success(' Contract renewed successfully!');
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        const msg = err.response?.data as { message?: string };
        toast.error(msg?.message || 'Failed to renew contract');
      }
    },
  });
};

// 5. عدم التجديد
export const useNonRenewContract = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => ContractsService.nonRenewContract(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      queryClient.invalidateQueries({ queryKey: ['contracts-expiring-soon'] });
      toast.success(' Contract marked as non-renewable');
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        const msg = err.response?.data as { message?: string };
        toast.error(msg?.message || 'Failed to mark contract as non-renewable');
      }
    },
  });
};

// 6. تنزيل العقد
export const useDownloadContract = () => {
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await ContractsService.downloadContract(id);
      return res.data;
    },
    onSuccess: (data) => {
      // إنشاء رابط وتنزيل الملف
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'contract.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success(' Contract downloaded successfully!');
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        const msg = err.response?.data as { message?: string };
        toast.error(msg?.message || 'Failed to download contract');
      }
    },
  });
};