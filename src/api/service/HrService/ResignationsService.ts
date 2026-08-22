import { apiClient } from '../../client';

export const ResignationsService = {  getAll: (type?: 'with_notice' | 'immediate') => {
    const url = type ? `/resignations?type=${type}` : '/resignations';
    return apiClient.get(url);
  },  getById: (id: number) => apiClient.get(`/resignations/${id}`),  classify: (id: number, data: { hr_classification: 'mutual_consent' | 'breach_by_company' | 'breach_by_employee'; hr_classification_notes: string }) =>
    apiClient.post(`/resignations/${id}/classify`, data),  downloadDocument: (resignationId: number, documentId: number) =>
    apiClient.get(`/resignations/${resignationId}/documents/${documentId}/download`, {
      responseType: 'blob',
    }),
};