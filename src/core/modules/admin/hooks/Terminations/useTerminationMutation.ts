import { useMutation, useQueryClient } from "@tanstack/react-query"
import { TerminationService } from "../../../../../api/service/adminService/TerminationService"
import { TERMINATION_KEYS } from "./useTerminations";

export const useApprove = () =>{
    const query = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) =>{
            const response = await TerminationService.approve(id)
            return response.data;
        },
        
        onSuccess: () =>{
            query.invalidateQueries({queryKey: TERMINATION_KEYS.all});
        }
    })
}

export const useReject = () =>{
    const query = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) =>{
            const response = await TerminationService.reject(id)
            return response.data;
        },
        
        onSuccess: () =>{
            query.invalidateQueries({queryKey: TERMINATION_KEYS.all});
        }
    })
}