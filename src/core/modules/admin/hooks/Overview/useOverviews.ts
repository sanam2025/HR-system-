import { useQuery } from "@tanstack/react-query"
import { OverviewService } from "../../../../../api/service/adminService/OverviewsService";

export const OVERVIEW_KEYS = {
    precentage: ['precentages'],
    payrolls: ['payrolls'],
    currentPayroll: ['current-payroll']
}


export const usePrecentages = () =>{
    return useQuery({
        queryKey: OVERVIEW_KEYS.precentage,
        queryFn: async () =>{
            const response = await OverviewService.getPrecentageAttendance();
            return response.data;
        },
        staleTime: 10 * 60 * 1000,
        gcTime: 15 * 60 * 1000,
    })
}


export const usePayrolls = () =>{
    return useQuery({
        queryKey: OVERVIEW_KEYS.payrolls,
        queryFn: async () =>{
            const response = await OverviewService.getAllPayroll();
            return response.data;
        },
        staleTime: 10 * 60 * 1000,
        gcTime: 15 * 60 * 1000,
    })
}

export const useCurrentPayroll = () =>{
    return useQuery({
        queryKey: OVERVIEW_KEYS.currentPayroll,
        queryFn: async () =>{
            const response = await OverviewService.getCurrentPayroll();
            console.log(response.data)
            return response.data;
        },
        staleTime: 10 * 60 * 1000,
        gcTime: 15 * 60 * 1000,
    })
}