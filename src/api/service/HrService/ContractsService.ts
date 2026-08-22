import { apiClient } from '../../client';

export const ContractsService = {  getAll: () => apiClient.get('/allcontracts'), // المسار سيتم تعديله حسب الكوليكشن الخاصة بك  getExpiringSoon: () => apiClient.get('/contracts/expiring-soon'),  getById: (id: number) => apiClient.get(`/employees/${id}/contract`),  downloadContract: (id: number) => apiClient.get(`/employees/${id}/contract/download`, {
    responseType: 'blob',
  }),  renewContract: (id: number, data: { new_start_date: string; new_end_date: string; new_hour_price: number }) =>
    apiClient.post(`/contracts/${id}/renewals`, data),  nonRenewContract: (id: number) => apiClient.patch(`/contracts/${id}/non-renewable`),
};