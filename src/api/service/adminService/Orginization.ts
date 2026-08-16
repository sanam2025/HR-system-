import { type UsersCount, type Department, type DepartmentCount } from "../../../core/modules/admin/types/types";
import { apiClient } from "../../apiClient";
import type { APIResponseWithData, APIResponseWithDataArray } from "../../Types/types.types";

export const OrginizationService = {
    getAll:() => apiClient.get<APIResponseWithDataArray<Department>>('departments/all'),
    getEmpAdnManagerCount: () => apiClient.get<APIResponseWithData<UsersCount>>('users/count'),
    getCount: () => apiClient.get<APIResponseWithData<DepartmentCount>>('departments/count')
}