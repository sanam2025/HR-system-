import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ContractsService } from '../../../../api/service/HrService/ContractsService';
import { AxiosError } from 'axios';export const useContracts = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['contracts'],
    queryFn: async () => {
      const res = await ContractsService.getAll();
      return res.data?.data || [];
    },
  });
  return { contracts: data || [], isLoading, error: error?.message, refetch };
};export const useContractsExpiringSoon = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['contracts-expiring-soon'],
    queryFn: async () => {
      const res = await ContractsService.getExpiringSoon();
      return res.data?.data || [];
    },
  });
  return { contracts: data || [], isLoading, error: error?.message, refetch };
};export const useContract = (id: number) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['contract', id],
    queryFn: async () => {
      const res = await ContractsService.getById(id);
      const raw = res.data?.data || res.data;
      if (!raw) return null;
      
      return {
        id: raw.id,
        contractNumber: `CONT-${raw.id}`,
        employeeName: raw.user?.full_name || 'Unknown',
        employeeEmail: raw.user?.email || '',
        department: raw.department || 'Unknown',
        position: 'Employee', // not provided by the API snippet
        startDate: raw.start_date,
        endDate: raw.end_date,
        salary: Number(raw.estimated_monthly_salary) || 0,
        status: raw.status || 'active',
        workingHours: raw.working_hours_per_day ? `${raw.working_hours_per_day} Hours/Day` : '8 Hours/Day',
        benefits: raw.jurisdiction || 'No specific benefits'
      };
    },
    enabled: !!id,
  });
  return { contract: data, isLoading, error: error?.message, refetch };
};export const useRenewContract = () => {
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
};export const useNonRenewContract = () => {
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
};export const useDownloadContract = () => {
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await ContractsService.downloadContract(id);
      return res.data;
    },
    onSuccess: (data) => {      const url = window.URL.createObjectURL(new Blob([data]));
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