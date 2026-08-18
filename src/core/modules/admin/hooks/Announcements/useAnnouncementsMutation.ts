import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { Announcements, CreateAnnouncemetPayload } from "../../types/types"
import { AnnouncementsService } from "../../../../../api/service/adminService/AnnouncementsService"
import { ANNOUNCEMENTS_KEY } from "./useAnnouncements";

export const useCreateAnnouncemet = () =>{
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async(announcementData: CreateAnnouncemetPayload) =>{
            const data = await AnnouncementsService.create(announcementData);
            return data;
        },
        onSuccess: () =>{
            queryClient.invalidateQueries({queryKey: ANNOUNCEMENTS_KEY.all});
        }
    })
}

export const useUpdateAnnouncement = () =>{
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async({id ,announcementData}: {id: number ,announcementData: Partial<Announcements>}) =>{
            const data = await AnnouncementsService.update(id , announcementData);
            return data;
        },

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ANNOUNCEMENTS_KEY.detail(variables.id) })
            queryClient.invalidateQueries({ queryKey: ANNOUNCEMENTS_KEY.all })
        }
    })
}

export const useDeleteAnnouncement = () =>{
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async(id: number) =>{
            const data = await AnnouncementsService.delete(id);
            return data;
        },
        onSuccess: () =>{
            queryClient.invalidateQueries({queryKey: ANNOUNCEMENTS_KEY.all})
        }
    })
}

export const usePublishAnnouncemet = () =>{
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async(id: number) =>{
            const data = await AnnouncementsService.publish(id);
            return data;
        },
        onSuccess: () =>{
            queryClient.invalidateQueries({queryKey: ANNOUNCEMENTS_KEY.all})
        }
    })
}