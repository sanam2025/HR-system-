import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { CreateHolidayPayload, Holidays } from "../../types/types"
import { HolidaysService } from "../../../../../api/service/adminService/HolidaysService"
import { HOLIDAYS_KEY } from "./useHolidays";

export const useCreateHolidays = () =>{
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async(holidayData: CreateHolidayPayload) =>{
            const data = await HolidaysService.create(holidayData);
            return data;
        },
        onSuccess: () =>{
            queryClient.invalidateQueries({queryKey: HOLIDAYS_KEY.all})
        }
    })
}

export const useDeleteHolidays = () =>{
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async(id: number) =>{
            const data = await HolidaysService.delete(id);
            return data;
        },
        onSuccess: () =>{
            queryClient.invalidateQueries({queryKey: HOLIDAYS_KEY.all})
        }
    })
}

export const useUpdateHoliday = () =>{
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async({id , updatedData}:{id: number , updatedData: any}) =>{
            const data = await HolidaysService.update(id , updatedData);
            return data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: HOLIDAYS_KEY.detail(variables.id) })
            queryClient.invalidateQueries({ queryKey: HOLIDAYS_KEY.all })
        }
    })
}