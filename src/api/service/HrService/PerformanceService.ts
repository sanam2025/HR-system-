import { apiClient } from '../../client';

export const PerformanceService = {  getPendingEvaluations: () => apiClient.get('/evaluations?pending_only=true'),  getEvaluationById: (id: number) => apiClient.get(`/evaluations/${id}`),  approveEvaluation: (id: number, data: { hr_notes: string }) =>
    apiClient.post(`/evaluations/${id}/hr-approve`, data),
};