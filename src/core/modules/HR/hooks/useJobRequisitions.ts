// src/core/modules/HR/hooks/useJobRequisitions.ts
import { useQuery } from "@tanstack/react-query";
import { RequestionService } from "../../../../api/service/HrService/RequestionService";
import type { JobRequisition } from "../../../../api/service/HrService/Types/HRService.types";

export const useJobRequisitions = () => {
  return useQuery<JobRequisition[]>({
    queryKey: ['job-requisitions'],
    queryFn: async () => {
      const response = await RequestionService.allRequestion();
      
      // ✅ إذا كانت response.data مصفوفة
      if (Array.isArray(response.data)) {
        return response.data;
      }
      
      // ✅ إذا كانت response.data فيها خاصية data مصفوفة
      if (response.data && typeof response.data === 'object') {
        const nestedData = (response.data as { data: JobRequisition[] }).data;
        if (Array.isArray(nestedData)) {
          return nestedData;
        }
      }
      
      // ✅ في النهاية، أرجع مصفوفة فارغة
      return [];
    },
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
};