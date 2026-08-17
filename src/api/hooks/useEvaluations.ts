import { useQuery } from "@tanstack/react-query";
import * as api from "../evaluations";
import { queryKeys } from "../queryKeys";

export function useMyEvaluations() {
  return useQuery({
    queryKey: queryKeys.evaluations.mine(),
    queryFn: () => api.listMyEvaluations(),
  });
}
