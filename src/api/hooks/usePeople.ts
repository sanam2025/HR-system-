import { useQuery } from "@tanstack/react-query";
import * as api from "../people";
import { queryKeys } from "../queryKeys";
import type { Colleague } from "../models";

/**
 * Combines `users/employees` and `users/managers` into a single
 * searchable people list (e.g. for picking who a complaint is about — a
 * complaint is very often about a manager, so they need to be selectable
 * too). Neither route is suffixed "employee" like the other self-service
 * routes in the collection, but both CONFIRMED live to return 200 for a
 * plain employee account. Names aren't unique in this dataset, so callers
 * must display more than just the name to disambiguate.
 */
export function usePeopleDirectory() {
  const employees = useQuery({
    queryKey: queryKeys.people.employees(),
    queryFn: () => api.listEmployees(),
  });
  const managers = useQuery({
    queryKey: queryKeys.people.managers(),
    queryFn: () => api.listManagers(),
  });

  const people: Colleague[] = [
    ...(employees.data ?? []).map((p) => ({ ...p, role: "employee" as const })),
    ...(managers.data ?? []).map((p) => ({ ...p, role: "manager" as const })),
  ];

  return {
    people,
    isLoading: employees.isLoading || managers.isLoading,
    isError: employees.isError || managers.isError,
    error: employees.error ?? managers.error,
  };
}

/**
 * Fetches only the members (manager and colleagues) in the current employee's department.
 */
export function useDepartmentMembers() {
  const query = useQuery({
    queryKey: [...queryKeys.people.all, "department"],
    queryFn: () => api.listDepartmentMembers(),
  });

  const people: Colleague[] = [];
  
  if (query.data) {
    if (query.data.manager) {
      people.push({ ...query.data.manager, role: "manager" });
    }
    if (Array.isArray(query.data.colleagues)) {
      query.data.colleagues.forEach((c) => {
        people.push({ ...c, role: "employee" });
      });
    }
  }

  return {
    people,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
