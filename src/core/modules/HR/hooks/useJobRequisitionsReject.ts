import { useMutation, useQueryClient } from "@tanstack/react-query"
import { RequestionService } from "../../../../api/service/HrService/RequestionService"

export const useJobRequisitionsReject = () =>{
    const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => RequestionService.rejectRequestion(id).then(res => res.data),

    onSuccess: () =>{
      queryClient.invalidateQueries({ queryKey: ['job-requisitions']});
    },

    onError: (error) => {
      console.error('Approval failed:', error);
    }
  })
}