import { httpClient, unwrap, unwrapPaginated } from "../lib/http/client";
import { endpoints } from "./endpoints";
import type { RequestOptions } from "../lib/http/client";
import type { MessageResponse, Paginated } from "../lib/http/types";
import type { CreateOvertimePayload, OvertimeRequest } from "./models";

export async function listMyOvertimeRequests(
  options?: RequestOptions
): Promise<Paginated<OvertimeRequest>> {
  const response = await httpClient.get(endpoints.overtime.mine, options);
  return unwrapPaginated<OvertimeRequest>(response);
}

export async function createOvertimeRequest(
  payload: CreateOvertimePayload,
  options?: RequestOptions
): Promise<OvertimeRequest> {
  const formData = new FormData();
  formData.append("date", payload.date);
  formData.append("start_time", payload.start_time);
  formData.append("end_time", payload.end_time);
  formData.append("notes", payload.notes ?? "");
  const response = await httpClient.post(endpoints.overtime.store, formData, options);
  return unwrap<OvertimeRequest>(response);
}

export async function deleteOvertimeRequest(
  id: number | string,
  options?: RequestOptions
): Promise<MessageResponse> {
  const response = await httpClient.delete(endpoints.overtime.remove(id), options);
  return unwrap<MessageResponse>(response);
}
