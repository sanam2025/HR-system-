import { useQuery } from "@tanstack/react-query"
import { SettingsService } from "../../../../../api/service/adminService/SettingsService"

export const SETTING_KEYS = {
    all: ['settings']
}

export const useSettings = () =>{
    return useQuery({
        queryKey: SETTING_KEYS.all,
        queryFn: async () =>{
            const response = await SettingsService.getAll();
            return response.data;
        },

        staleTime: 10 * 60 * 1000,
        gcTime: 20 * 60 * 1000,
    })
}