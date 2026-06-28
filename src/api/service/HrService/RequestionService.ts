// src/api/service/HrService/RequestionService.ts
import type { APIResponseWithData } from "../../../Types/types.types";
import { apiClient } from "../../client";
import type { JobRequisitionReject, JobRequisition, JobRequisitionApprove } from "./Types/HRService.types";

export const RequestionService = {
  // ✅ التصحيح: استخدم JobRequisition[] مباشرة
  allRequestion: () => apiClient.get<JobRequisition[]>('job-requisitions/all'),
  approveRequestion: (id: number) => apiClient.post<APIResponseWithData<JobRequisitionApprove>>(`job-requisitions/${id}/approve`),
  rejectRequestion: (id: number) => apiClient.post<APIResponseWithData<JobRequisitionReject>>(`job-requisitions/${id}/reject`)
};