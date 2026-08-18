import { getListOrEmpty, httpClient, unwrap } from "../lib/http/client";
import { endpoints } from "./endpoints";
import type { RequestOptions } from "../lib/http/client";
import type { CreateOvertimePayload, Overtime } from "./models";

/** Employee requests voluntary overtime for themselves. */
export async function storeOvertimeByEmployee(
  payload: CreateOvertimePayload,
  options?: RequestOptions
): Promise<Overtime> {
  const form = new FormData();
  form.append("date", payload.date);
  form.append("start_time", payload.start_time);
  form.append("end_time", payload.end_time);
  if (payload.notes) form.append("notes", payload.notes);
  const response = await httpClient.post(endpoints.overtime.storeByEmployee, form, options);
  return unwrap<Overtime>(response);
}

export async function listMyOvertimes(options?: RequestOptions): Promise<Overtime[]> {
  return getListOrEmpty<Overtime>(endpoints.overtime.mine, options);
}
