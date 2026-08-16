import { useQuery } from "@tanstack/react-query"
import { OrginizationService } from "../../../../../api/service/adminService/Orginization"

export const DEPARTMENT_KEYS = {
    all: ['department'],
    Userscounts: ['department-users-counts'],
    counts: ['department-counts'],
}

export const useDepartments = () =>{
    return useQuery({
        queryKey: DEPARTMENT_KEYS.all,
        queryFn: async() =>{
            const response = await OrginizationService.getAll();
            return response.data;
        },

        staleTime: 10 * 60 * 1000,
        gcTime: 20 * 60 * 1000,
    })
}

export const useDepartmentsCount = () =>{
    return useQuery({
        queryKey: DEPARTMENT_KEYS.counts,
        queryFn: async() =>{
            const response = await OrginizationService.getCount();
            return response.data;
        },

        staleTime: 10 * 60 * 1000,
        gcTime: 20 * 60 * 1000,
    })
}

export const useUsersCount = () =>{
    return useQuery({
        queryKey: DEPARTMENT_KEYS.Userscounts,
        queryFn: async() =>{
            const response = await OrginizationService.getEmpAdnManagerCount();
            return response.data;
        },

        staleTime: 10 * 60 * 1000,
        gcTime: 20 * 60 * 1000,
    })
}

