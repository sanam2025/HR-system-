import { useMutation, useQueryClient } from "@tanstack/react-query"
import { OverviewService } from "../../../../../api/service/adminService/OverviewsService"
import { OVERVIEW_KEYS } from "./useOverviews";

export const useGeneratePayroll = () =>{
    const query = useQueryClient();
    return useMutation({
        mutationFn: async() =>{
            const response = await OverviewService.generatePayroll();
            return response.data;
        },
        onSuccess: () =>{
            query.invalidateQueries({queryKey: OVERVIEW_KEYS.payrolls}),
            query.invalidateQueries({queryKey: OVERVIEW_KEYS.currentPayroll})
        }
    })
}