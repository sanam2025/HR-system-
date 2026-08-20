import { getListOrEmpty } from "../lib/http/client";
import { endpoints } from "./endpoints";
import type { RequestOptions } from "../lib/http/client";
import type { Colleague } from "./models";

export async function listEmployees(options?: RequestOptions): Promise<Omit<Colleague, "role">[]> {
  return getListOrEmpty<Omit<Colleague, "role">>(endpoints.people.employees, options);
}

export async function listManagers(options?: RequestOptions): Promise<Omit<Colleague, "role">[]> {
  return getListOrEmpty<Omit<Colleague, "role">>(endpoints.people.managers, options);
}

export interface DepartmentMembersResponse {
  department_id: number;
  manager: Omit<Colleague, "role"> | null;
  colleagues: Omit<Colleague, "role">[];
}

export async function listDepartmentMembers(options?: RequestOptions): Promise<DepartmentMembersResponse> {
  const { httpClient, unwrap } = await import("../lib/http/client");
  const response = await httpClient.get(endpoints.people.departmentMembers, options);
  return unwrap<DepartmentMembersResponse>(response);
}
