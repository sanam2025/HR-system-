import { getListOrEmpty, httpClient, unwrap } from "../lib/http/client";
import { endpoints } from "./endpoints";
import type { RequestOptions } from "../lib/http/client";
import type { MessageResponse } from "../lib/http/types";
import type {
  CreateHourlyLeaveRequestPayload,
  HourlyLeaveRequest,
  LeaveRequestStatus,
  UpdateHourlyLeaveRequestPayload,
} from "./models";

export async function createHourlyLeaveRequest(
  payload: CreateHourlyLeaveRequestPayload,
  options?: RequestOptions
): Promise<HourlyLeaveRequest> {
  const response = await httpClient.post(endpoints.hourlyLeaveRequests.create, payload, options);
  return unwrap<HourlyLeaveRequest>(response);
}

export async function getHourlyLeaveRequest(
  id: number,
  options?: RequestOptions
): Promise<HourlyLeaveRequest> {
  const response = await httpClient.get(endpoints.hourlyLeaveRequests.show(id), options);
  return unwrap<HourlyLeaveRequest>(response);
}

export async function updateHourlyLeaveRequest(
  id: number,
  payload: UpdateHourlyLeaveRequestPayload,
  options?: RequestOptions
): Promise<HourlyLeaveRequest> {
  const response = await httpClient.put(endpoints.hourlyLeaveRequests.update(id), payload, options);
  return unwrap<HourlyLeaveRequest>(response);
}

export async function deleteHourlyLeaveRequest(
  id: number,
  options?: RequestOptions
): Promise<MessageResponse> {
  const response = await httpClient.delete(endpoints.hourlyLeaveRequests.remove(id), options);
  return unwrap<MessageResponse>(response);
}

/** The signed-in employee's own hourly leave requests, optionally filtered by status. */
export async function listMyHourlyLeaveRequests(
  params: { status?: LeaveRequestStatus } = {},
  options?: RequestOptions
): Promise<HourlyLeaveRequest[]> {
  return getListOrEmpty<HourlyLeaveRequest>(endpoints.hourlyLeaveRequests.list, {
    ...options,
    params: { ...params, ...options?.params },
  });
}
