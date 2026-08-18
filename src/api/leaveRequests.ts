import { getListOrEmpty, httpClient, unwrap } from "../lib/http/client";
import { endpoints } from "./endpoints";
import type { RequestOptions } from "../lib/http/client";
import type { MessageResponse } from "../lib/http/types";
import type {
  CreateLeaveRequestPayload,
  LeaveBalance,
  LeaveRequest,
  LeaveRequestStatus,
  UpdateLeaveRequestPayload,
} from "./models";

export async function createLeaveRequest(
  payload: CreateLeaveRequestPayload,
  options?: RequestOptions
): Promise<LeaveRequest> {
  const response = await httpClient.post(endpoints.leaveRequests.create, payload, options);
  return unwrap<LeaveRequest>(response);
}

export async function getLeaveRequest(
  id: number,
  options?: RequestOptions
): Promise<LeaveRequest> {
  const response = await httpClient.get(endpoints.leaveRequests.show(id), options);
  return unwrap<LeaveRequest>(response);
}

export async function updateLeaveRequest(
  id: number,
  payload: UpdateLeaveRequestPayload,
  options?: RequestOptions
): Promise<LeaveRequest> {
  const response = await httpClient.put(endpoints.leaveRequests.update(id), payload, options);
  return unwrap<LeaveRequest>(response);
}

export async function deleteLeaveRequest(
  id: number,
  options?: RequestOptions
): Promise<MessageResponse> {
  const response = await httpClient.delete(endpoints.leaveRequests.remove(id), options);
  return unwrap<MessageResponse>(response);
}

/** The signed-in employee's own leave requests, optionally filtered by status. */
export async function listMyLeaveRequests(
  params: { status?: LeaveRequestStatus } = {},
  options?: RequestOptions
): Promise<LeaveRequest[]> {
  return getListOrEmpty<LeaveRequest>(endpoints.leaveRequests.mine, {
    ...options,
    params: { ...params, ...options?.params },
  });
}

/** The signed-in employee's own leave balance. */
export async function getMyLeaveBalance(options?: RequestOptions): Promise<LeaveBalance> {
  const response = await httpClient.get(endpoints.leaveRequests.myBalance, options);
  return unwrap<LeaveBalance>(response);
}
