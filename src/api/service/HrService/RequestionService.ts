// src/api/service/HrService/RequestionService.ts
import type { APIResponseWithData } from "../../../Types/types.types";
import apiClient from '@/api/axios';
import type { JobRequisitionReject, JobRequisition, JobRequisitionApprove } from "./Types/HRService.types";

export const RequestionService = {
  allRequestion: () => apiClient.get<JobRequisition[]>('job-requisitions/all'),
  approveRequestion: (id: number) => apiClient.post<APIResponseWithData<JobRequisitionApprove>>(`job-requisitions/${id}/approve`),
  rejectRequestion: (id: number) => apiClient.post<APIResponseWithData<JobRequisitionReject>>(`job-requisitions/${id}/reject`),
  
  // إضافة دالة getById
  getById: (id: number) => apiClient.get<JobRequisition>(`job-requisitions/${id}`),
};