import { useMutation, useQueryClient } from "@tanstack/react-query"
import { SettingsService } from "../../../../../api/service/adminService/SettingsService"
import type { Settings } from "../../types/types"
import { SETTING_KEYS } from "./useSettings";

export const useUpdateSettings = () =>{
    const query = useQueryClient();

    return useMutation({
        mutationFn: async (settings: Partial<Settings>) => {
            const response = await SettingsService.update(settings);
            return response.data;
        },
        onSuccess: () =>{
            query.invalidateQueries({queryKey: SETTING_KEYS.all});
        }
    })
}