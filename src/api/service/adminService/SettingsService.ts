import type { Settings } from "../../../core/modules/admin/types/types";
import { apiClient } from "../../apiClient";
import type { APIResponseWithData, APIResponseWithOnlyData } from "../../Types/types.types";

export const SettingsService = {
    getAll: () => apiClient.get<APIResponseWithOnlyData<Settings>>('settings'),
    update: (data: Partial<Settings>) => {
        return apiClient.put<APIResponseWithData<Settings>>('settings', data);
    }
};