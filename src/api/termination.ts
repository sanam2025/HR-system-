import apiClient from './axios';
export interface TerminationRequest {
  id: number;
  user_id: number;
  employee_name?: string;
  type: string;
  subtype: string;
  termination_date: string;
  legal_reason?: string;
  status: 'pending' | 'approved' | 'rejected';
  documents?: string;
  created_at?: string;
  decision_reason?: string;
  user?: {
    id: number;
    name: string;
    first_name?: string;
    last_name?: string;
  };
}

export interface ApproveRejectPayload {
  decision_reason?: string;
}
export const terminationApi = {  getTerminationRequests: async (): Promise<TerminationRequest[]> => {
    const response = await apiClient.get('/termination-requests');    return response.data?.data || response.data || [];
  },  getMyCreatedTerminations: async (): Promise<TerminationRequest[]> => {
    const response = await apiClient.get('/my-termination-requests');
    return response.data?.data || response.data || [];
  },  getTermination: async (id: number): Promise<TerminationRequest> => {
    const response = await apiClient.get('/termination-requests/' + id);
    return response.data?.data || response.data;
  },  storeTerminationRequest: async (formData: FormData): Promise<any> => {
    const response = await apiClient.post('/store-termination', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },  approveTermination: async (id: number, payload: ApproveRejectPayload): Promise<any> => {
    const response = await apiClient.put('/approve/' + id + '/termination', payload);
    return response.data;
  },  rejectTermination: async (id: number, payload: ApproveRejectPayload): Promise<any> => {
    const response = await apiClient.put('/reject/' + id + '/termination', payload);
    return response.data;
  },  deleteTermination: async (id: number): Promise<any> => {
    const response = await apiClient.delete('/termination-requests/' + id);
    return response.data;
  }
};
