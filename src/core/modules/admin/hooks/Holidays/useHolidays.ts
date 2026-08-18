import { useQuery } from "@tanstack/react-query"
import { HolidaysService } from "../../../../../api/service/adminService/HolidaysService"

export const HOLIDAYS_KEY = {
    all: ['holidays'],
    detail: (id: number) => [...HOLIDAYS_KEY.all, 'detail', id],
}

export const useHolidays = () =>{
    return useQuery({
        queryKey: HOLIDAYS_KEY.all,
        queryFn: async () =>{
            const holidays = await HolidaysService.getAll()
            return holidays;
        },
        gcTime: 30 * 60 * 1000,
        staleTime: 20 * 60 * 10000
    })
}