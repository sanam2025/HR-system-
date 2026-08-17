import { httpClient, unwrap, unwrapPaginated } from "../lib/http/client";
import { endpoints } from "./endpoints";
import type { RequestOptions } from "../lib/http/client";
import type { MessageResponse, Paginated } from "../lib/http/types";
import type { CreateTerminationPayload, TerminationRequest } from "./models";

export async function listMyTerminationRequests(
  options?: RequestOptions
): Promise<Paginated<TerminationRequest>> {
  const response = await httpClient.get(endpoints.termination.mine, options);
  return unwrapPaginated<TerminationRequest>(response);
}

export async function createTerminationRequest(
  payload: CreateTerminationPayload,
  options?: RequestOptions
): Promise<TerminationRequest> {
  const formData = new FormData();
  formData.append("user_id", String(payload.user_id));
  formData.append("type", payload.type);
  formData.append("termination_date", payload.termination_date);
  formData.append("subtype", payload.subtype);
  formData.append("legal_reason", payload.legal_reason);
  const response = await httpClient.post(endpoints.termination.store, formData, options);
  return unwrap<TerminationRequest>(response);
}

export async function deleteTerminationRequest(
  id: number | string,
  options?: RequestOptions
): Promise<MessageResponse> {
  const response = await httpClient.delete(endpoints.termination.remove(id), options);
  return unwrap<MessageResponse>(response);
}
