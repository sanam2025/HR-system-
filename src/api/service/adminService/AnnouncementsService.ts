import type { Announcements, CreateAnnouncemetPayload } from "../../../core/modules/admin/types/types";
import { apiClient } from "../../apiClient";
import type { APIResponseWithOnlyData, APIResponseWithOnlyDataArray } from "../../Types/types.types";

export const AnnouncementsService = {
    create:(data: CreateAnnouncemetPayload) => apiClient.post<APIResponseWithOnlyData<Announcements>>('announcements' , data),
    update:(id: number , data:Partial<Announcements>) =>apiClient.put<APIResponseWithOnlyData<Announcements>>(`announcements/${id}` , data),
    delete:(id: number) => apiClient.delete(`announcements/${id}`),
    publish:(id: number) => apiClient.patch<APIResponseWithOnlyData<Announcements>>(`announcements/${id}/publish`),

    getAll:() =>apiClient.get<APIResponseWithOnlyDataArray<Announcements>>('announcements'),
    getActive:() =>apiClient.get<APIResponseWithOnlyDataArray<Announcements>>('announcements/active'),
    show:() =>{},
}