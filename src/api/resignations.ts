import { getListOrEmpty, httpClient, unwrap } from "../lib/http/client";
import { endpoints } from "./endpoints";
import type { RequestOptions } from "../lib/http/client";
import type { CreateResignationPayload, Resignation } from "./models";

export async function createResignation(
  payload: CreateResignationPayload,
  options?: RequestOptions
): Promise<Resignation> {
  const response = await httpClient.post(endpoints.resignations.create, payload, options);
  return unwrap<Resignation>(response);
}

/**
 * CONFIRMED via live backend testing: this route 403s "User does not have
 * the right roles." for a real employee even though `POST /resignations`
 * (submitting one) works fine for the same account — looks like a backend
 * role-middleware bug on this specific route rather than an intentional
 * restriction. `getListOrEmpty` only tolerates 404-as-empty, not 403, so a
 * 403 here still surfaces as a real error — which is honest given it's
 * unclear whether this is fixable client-side at all.
 */
export async function listMyResignations(options?: RequestOptions): Promise<Resignation[]> {
  return getListOrEmpty<Resignation>(endpoints.resignations.mine, options);
}
