import type { CreateHolidayPayload, Holidays } from "../../../core/modules/admin/types/types";
import { apiClient } from "../../apiClient";
import type { APIResponseWithData, APIResponseWithDataArray } from "../../Types/types.types";


export const HolidaysService = {
    create: (data: CreateHolidayPayload) => apiClient.post<APIResponseWithData<Holidays>>('holidays' , data),
    update: (id: number , data: Omit<Partial<Holidays> , 'id' | 'updated_at' | 'created_at'>) => apiClient.put<APIResponseWithData<Holidays>>(`holidays/${id}` , data),
    delete: (id: number) => apiClient.delete(`holidays/${id}`),

    getAll: () => apiClient.get<APIResponseWithDataArray<Holidays>>('holidays'),
    show: (id: number) => apiClient.get<APIResponseWithData<Holidays>>(`holidays/${id}`)
}