import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "../tasks";
import { queryKeys } from "../queryKeys";
import type { SubmitTaskPayload, TaskFilterParams } from "../models";
import type { RequestOptions } from "../../lib/http/client";

export type UseTasksOptions = Omit<RequestOptions, "params"> & {
  enabled?: boolean;
};

export function useTasks(
  params: TaskFilterParams = {},
  options: UseTasksOptions = {}
) {
  const { enabled = true, ...requestOptions } = options;
  return useQuery({
    queryKey: queryKeys.tasks.list(params),
    queryFn: () => api.listTasks(params, requestOptions),
    enabled,
  });
}

export function useTask(id: number) {
  return useQuery({
    queryKey: queryKeys.tasks.detail(id),
    queryFn: () => api.getTask(id),
    enabled: Number.isFinite(id),
  });
}

export function useStartTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.startTask(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all }),
  });
}

export function useSubmitTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: SubmitTaskPayload }) =>
      api.submitTask(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all }),
  });
}
