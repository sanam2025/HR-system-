import { type Managers, type EmployeeSearch, type TopRate } from "../../../core/modules/admin/types/types";
import { apiClient } from "../../apiClient";
import { type APIResponseWithData, type APIResponseWithDataArray, type EmployeesAPIResponse } from "../../Types/types.types";

export const EmployeesService = {
    getAllEmployees: () => apiClient.get<EmployeesAPIResponse>('by-role-users'),
    getAllManagers: () => apiClient.get<APIResponseWithDataArray<Managers>>('users/managers'),

    getSearch: (searchTerm: string) => apiClient.get<EmployeeSearch[]>('search-employees', {
        params: { search: searchTerm }
    }),

    getTopRate: () => apiClient.get<APIResponseWithData<TopRate>>('top-performance')
}