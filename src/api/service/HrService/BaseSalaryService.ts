import { apiClient } from '../../client';

export const BaseSalaryService = {  getMyBaseSalaries: () => apiClient.get('/my-base-salaries'),  getEmployeeSalaries: (id: number) => apiClient.get(`/base/${id}/employee-salaries`),  increaseHourPrice: (id: number, data: { hour_price: number; reason: string }) =>
    apiClient.post(`/increase/${id}/employee-hour-price`, data),
};