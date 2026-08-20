import { getListOrEmpty, httpClient, unwrap } from "../lib/http/client";
import { endpoints } from "./endpoints";
import type { RequestOptions } from "../lib/http/client";
import type { Complaint, CreateComplaintPayload } from "./models";

export async function createComplaint(
  payload: CreateComplaintPayload,
  options?: RequestOptions
): Promise<Complaint> {
  const response = await httpClient.post(endpoints.complaints.create, payload, options);
  return unwrap<Complaint>(response);
}

export async function listMyComplaints(options?: RequestOptions): Promise<Complaint[]> {
  return getListOrEmpty<Complaint>(endpoints.complaints.mine, options);
}
