import { httpClient, unwrapPaginated } from "../lib/http/client";
import { endpoints } from "./endpoints";
import type { RequestOptions } from "../lib/http/client";
import type { Paginated } from "../lib/http/types";
import type { Evaluation } from "./models";

export async function listMyEvaluations(
  options?: RequestOptions
): Promise<Paginated<Evaluation>> {
  const response = await httpClient.get(endpoints.evaluations.mine, options);
  return unwrapPaginated<Evaluation>(response);
}
