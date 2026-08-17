import { httpClient, unwrap, unwrapPaginated } from "../lib/http/client";
import { endpoints } from "./endpoints";
import type { RequestOptions } from "../lib/http/client";
import type { Paginated } from "../lib/http/types";
import type { SubmitTaskPayload, Task, TaskFilterParams } from "./models";

export async function listTasks(
  params: TaskFilterParams = {},
  options?: RequestOptions
): Promise<Paginated<Task>> {
  const response = await httpClient.get(endpoints.tasks.list, {
    ...options,
    params: { ...params, ...options?.params },
  });
  return unwrapPaginated<Task>(response);
}

export async function getTask(id: number | string, options?: RequestOptions): Promise<Task> {
  const response = await httpClient.get(endpoints.tasks.show(id), options);
  return unwrap<Task>(response);
}

/** Marks a task as started. No request body in the collection's example. */
export async function startTask(id: number | string, options?: RequestOptions): Promise<Task> {
  const response = await httpClient.post(endpoints.tasks.start(id), undefined, options);
  return unwrap<Task>(response);
}

export async function submitTask(
  id: number | string,
  payload: SubmitTaskPayload,
  options?: RequestOptions
): Promise<Task> {
  const formData = new FormData();
  formData.append("notes", payload.notes);
  if (payload.attachment) {
    formData.append("attachment", payload.attachment);
  }
  const response = await httpClient.post(endpoints.tasks.submit(id), formData, options);
  return unwrap<Task>(response);
}
