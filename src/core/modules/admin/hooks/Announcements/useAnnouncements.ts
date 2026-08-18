import { useQuery } from "@tanstack/react-query"
import { AnnouncementsService } from "../../../../../api/service/adminService/AnnouncementsService"

export const ANNOUNCEMENTS_KEY = {
    all: ['announcements'],
    detail: (id: number) => [...ANNOUNCEMENTS_KEY.all, 'detail', id], 
}


export const useAnnouncements = () =>{
    return useQuery({
        queryKey: ANNOUNCEMENTS_KEY.all,
        queryFn: async() =>{
            const response = await AnnouncementsService.getAll();
            return response;
        }
    })
}
