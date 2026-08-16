import type { Termination } from "../../../core/modules/admin/types/types";
import { apiClient } from "../../apiClient";
import type { APIResponseWithOnlyDataArray } from "../../Types/types.types";

export const TerminationService = {
    getAll: () => apiClient.get<APIResponseWithOnlyDataArray<Termination>>('termination-requests'),
    approve: (id:number) => apiClient.put(`approve/${id}/termination`),
    reject: (id:number) => apiClient.put(`reject/${id}/termination`),
}