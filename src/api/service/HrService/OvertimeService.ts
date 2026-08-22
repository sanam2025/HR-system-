import { apiClient } from '../../client';

export const OvertimeService = {  getMandatory: () => apiClient.get('/mandatory-overtime'),  getVoluntary: () => apiClient.get('/voluntary-overtime'),  getDepartmentOvertime: () => apiClient.get('/my-department-overtime'),  getById: (id: number) => apiClient.get(`/overtimes/${id}`),  approveMandatory: (id: number) => apiClient.put(`/mandatory-overtime/${id}/approve`),  rejectMandatory: (id: number) => apiClient.put(`/mandatory-overtime/${id}/reject`),  delete: (id: number) => apiClient.delete(`/delete-overtime/${id}/request`),
};