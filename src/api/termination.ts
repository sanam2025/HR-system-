import apiClient from './axios';

// ── Types ──

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

// ── API Functions ──

export const terminationApi = {
  // Get all termination requests (For Manager / HR)
  getTerminationRequests: async (): Promise<TerminationRequest[]> => {
    const response = await apiClient.get('/termination-requests');
    // Assuming backend wraps in { data: ... } or returns array directly
    return response.data?.data || response.data || [];
  },

  // Get terminations created by the logged in manager
  getMyCreatedTerminations: async (): Promise<TerminationRequest[]> => {
    const response = await apiClient.get('/my-termination-requests');
    return response.data?.data || response.data || [];
  },

  // Get specific termination details
  getTermination: async (id: number): Promise<TerminationRequest> => {
    const response = await apiClient.get('/termination-requests/' + id);
    return response.data?.data || response.data;
  },

  // Store a new termination request
  storeTerminationRequest: async (formData: FormData): Promise<any> => {
    const response = await apiClient.post('/store-termination', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Approve a termination request
  approveTermination: async (id: number, payload: ApproveRejectPayload): Promise<any> => {
    const response = await apiClient.put('/approve/' + id + '/termination', payload);
    return response.data;
  },

  // Reject a termination request
  rejectTermination: async (id: number, payload: ApproveRejectPayload): Promise<any> => {
    const response = await apiClient.put('/reject/' + id + '/termination', payload);
    return response.data;
  },

  // Delete a termination request
  deleteTermination: async (id: number): Promise<any> => {
    const response = await apiClient.delete('/termination-requests/' + id);
    return response.data;
  }
};
