import { httpClient, unwrap, unwrapPaginated } from "../lib/http/client";
import { endpoints } from "./endpoints";
import { ApiError } from "../lib/http/ApiError";
import type { RequestOptions } from "../lib/http/client";
import type { Paginated } from "../lib/http/types";
import type { SubmitTaskPayload, Task, TaskFilterParams } from "./models";

const EMPTY_PAGE: Paginated<Task> = { items: [], page: 1, perPage: 0, total: 0, lastPage: 1 };

export async function listTasks(
  params: TaskFilterParams = {},
  options?: RequestOptions
): Promise<Paginated<Task>> {
  try {
    const response = await httpClient.get(endpoints.tasks.list, {
      ...options,
      params: { ...params, ...options?.params },
    });
    return unwrapPaginated<Task>(response);
  } catch (error) {
    if (ApiError.from(error).kind === "not_found") return EMPTY_PAGE;
    throw error;
  }
}

export async function getTask(id: number, options?: RequestOptions): Promise<Task> {
  const response = await httpClient.get(endpoints.tasks.show(id), options);
  return unwrap<Task>(response);
}

/** Employee marks an assigned task as started. */
export async function startTask(id: number, options?: RequestOptions): Promise<Task> {
  const response = await httpClient.post(endpoints.tasks.start(id), undefined, options);
  return unwrap<Task>(response);
}

/** Employee submits a started task for review, with optional attachment. */
export async function submitTask(
  id: number,
  payload: SubmitTaskPayload,
  options?: RequestOptions
): Promise<Task> {
  const form = new FormData();
  form.append("notes", payload.notes);
  if (payload.attachment) form.append("attachment", payload.attachment);
  const response = await httpClient.post(endpoints.tasks.submit(id), form, options);
  return unwrap<Task>(response);
}
