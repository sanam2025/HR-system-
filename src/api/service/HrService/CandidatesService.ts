import { apiClient } from "../../client";
import type { CandidateResponse, CandidatesResponse } from "./Types/CandidatesService.types";
import type { APIResponseWithData } from "./Types/types.types";

export const CandidatesService = {  getByJobId: (jobId: number) => {    if (!jobId || isNaN(jobId)) {
      throw new Error('Invalid job ID');
    }
    return apiClient.get<CandidatesResponse>(`job-postings/${jobId}/candidates`);
  },  getById: (id: number) => 
    apiClient.get<CandidateResponse>(`candidates/${id}`),  getCV: (id: number) => 
    apiClient.get<APIResponseWithData<{ url: string; expires: number; signature: string }>>(`candidates/${id}/cv`),  updateStatus: (id: number, status: string) => 
    apiClient.patch<CandidateResponse>(`candidates/${id}/status?status=${status}`),
};