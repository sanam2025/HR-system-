import { useQuery } from "@tanstack/react-query"
import { EmployeesService } from "../../../../../api/service/adminService/EmployeesService"

export const USER_KEYS ={
    all: ['users'],
    top_rate: ['top-rate'],
    search: (searchTerm: string ) => [...USER_KEYS.all  , 'search' , searchTerm]
}

export const useEmployees = () =>{
    return useQuery({
        queryKey: USER_KEYS.all,
        queryFn: async () =>{
            const response = await EmployeesService.getAllEmployees();
            return response.data;
        },

        staleTime: 10 * 60 * 1000,
        gcTime: 20 * 60 * 1000,
    })
}

export const useEmployeesSearch = (searchTerm: string) => {
  return useQuery({
    queryKey: USER_KEYS.search(searchTerm),
    queryFn: async () => {
      const response = await EmployeesService.getSearch(searchTerm);
      return response.data || [];
    },
    enabled: searchTerm.length > 0
  })
}

export const useTopRateEmplyees = () =>{
    return useQuery({
    queryKey: USER_KEYS.top_rate,
    queryFn: async () => {
      const response = await EmployeesService.getTopRate();
      return response.data?.data || null;
    },
        staleTime: 10 * 60 * 1000,
        gcTime: 20 * 60 * 1000,
  })
}