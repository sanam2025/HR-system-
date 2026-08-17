import { httpClient, unwrap, unwrapPaginated } from "../lib/http/client";
import { endpoints } from "./endpoints";
import type { RequestOptions } from "../lib/http/client";
import type { Paginated } from "../lib/http/types";
import type { Complaint, CreateComplaintPayload } from "./models";

export async function listMyComplaints(options?: RequestOptions): Promise<Paginated<Complaint>> {
  const response = await httpClient.get(endpoints.complaints.mine, options);
  return unwrapPaginated<Complaint>(response);
}

export async function createComplaint(
  payload: CreateComplaintPayload,
  options?: RequestOptions
): Promise<Complaint> {
  const response = await httpClient.post(endpoints.complaints.store, payload, options);
  return unwrap<Complaint>(response);
}
