import { useQuery } from "@tanstack/react-query"
import { RequestionService } from "../../../../api/service/HrService/RequestionService"

export const useJobRequisitions = () =>{
  return useQuery({
    queryKey: ['job-requisitions'],
    queryFn: async () => {
      const response = await RequestionService.allRequestion();
      return response.data?.data || [];
    },
    
    staleTime: 30 * 60 * 1000,
    gcTime: 60  * 60 * 1000,
  })
}