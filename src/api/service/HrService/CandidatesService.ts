// src/api/service/HrService/CandidatesService.ts
import { apiClient } from "../../client";
import type { CandidateResponse, CandidatesResponse } from "./Types/CandidatesService.types";
import type { APIResponseWithData } from "./Types/types.types";

export const CandidatesService = {
  // جلب كل المتقدمين على وظيفة معينة
  getByJobId: (jobId: number) => {
    // ✅ تحقق من صحة jobId
    if (!jobId || isNaN(jobId)) {
      throw new Error('Invalid job ID');
    }
    return apiClient.get<CandidatesResponse>(`job-postings/${jobId}/candidates`);
  },
  
  // جلب متقدم واحد
  getById: (id: number) => 
    apiClient.get<CandidateResponse>(`candidates/${id}`),
  
  // جلب رابط السيرة الذاتية (مؤقت)
  getCV: (id: number) => 
    apiClient.get<APIResponseWithData<{ url: string; expires: number; signature: string }>>(`candidates/${id}/cv`),
  
  // تحديث حالة المتقدم
  updateStatus: (id: number, status: string) => 
    apiClient.patch<CandidateResponse>(`candidates/${id}/status?status=${status}`),
};