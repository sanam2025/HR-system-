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

export function useTask(id: number | string | undefined) {
  return useQuery({
    queryKey: queryKeys.tasks.show(id ?? ""),
    queryFn: () => api.getTask(id as number | string),
    enabled: id !== undefined,
  });
}

export function useStartTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => api.startTask(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.show(id) });
    },
  });
}

export function useSubmitTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number | string; payload: SubmitTaskPayload }) =>
      api.submitTask(id, payload),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.show(id) });
    },
  });
}
