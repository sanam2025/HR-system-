import type{  APIResponseWithData } from "../../../Types/types.types";
import { apiClient } from "../../client";
import type{ JobRequisitionReject, JobRequisition, JobRequisitionApprove } from "./Types/HRService.types";


export const RequestionService = {
  allRequestion: () => apiClient.get<APIResponseWithData<JobRequisition>>('job-requisitions/all'),
  approveRequestion: (id: number) => apiClient.post<APIResponseWithData<JobRequisitionApprove>>(`job-requisitions/${id}/approve`),
  rejectRequestion: (id: number) => apiClient.post<APIResponseWithData<JobRequisitionReject>>(`job-requisitions/${id}/reject`)
};