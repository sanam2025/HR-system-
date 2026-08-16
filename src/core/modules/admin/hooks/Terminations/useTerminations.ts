import { useQuery } from "@tanstack/react-query"
import { TerminationService } from "../../../../../api/service/adminService/TerminationService"


export const TERMINATION_KEYS = {
    all: ['terminations'],
}

export const useTerminations = () =>{
    return useQuery({
        queryKey:TERMINATION_KEYS.all,
        queryFn: async() =>{
            const response = await TerminationService.getAll();
            return response.data;
        }
    })
}