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
