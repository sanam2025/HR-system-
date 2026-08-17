import { httpClient, unwrap } from "../lib/http/client";
import { endpoints } from "./endpoints";
import type { RequestOptions } from "../lib/http/client";
import type { MessageResponse } from "../lib/http/types";
import type { Contract, EmployeeDocument, OnboardingStatusResponse, OnboardingUploadPayload } from "./models";

export async function uploadOnboardingDocuments(
  payload: OnboardingUploadPayload,
  options?: RequestOptions
): Promise<MessageResponse> {
  const form = new FormData();
  form.append("id_card", payload.id_card);
  form.append("photo", payload.photo);
  form.append("bank_info", payload.bank_info);

  const response = await httpClient.post(endpoints.onboarding.upload, form, options);
  return unwrap<MessageResponse>(response);
}

/**
 * CONFIRMED via scripts/probe_api.py against the live deployment: this
 * route exists (401 Unauthenticated, not 404) despite the Postman
 * collection's "onboarding status e" request having no URL. Response
 * shape is still unverified pending valid test credentials. See
 * CHANGELOG.md.
 */
export async function getOnboardingStatus(
  options?: RequestOptions
): Promise<OnboardingStatusResponse> {
  const response = await httpClient.get(endpoints.onboarding.status, options);
  const res = unwrap<OnboardingStatusResponse>(response) as any;
  return {
    completed: Boolean(res.completed),
    uploaded_documents: Array.isArray(res.uploaded_documents) ? res.uploaded_documents : [],
    missing_documents: Array.isArray(res.missing_documents) ? res.missing_documents : [],
  };
}

export async function getMyContract(options?: RequestOptions): Promise<Contract> {
  const response = await httpClient.get(endpoints.documents.myContract, options);
  return unwrap<Contract>(response);
}

export async function downloadMyContract(options?: RequestOptions): Promise<Blob> {
  const response = await httpClient.get(endpoints.documents.downloadMyContract, {
    ...options,
    responseType: "blob",
  });
  return response.data as Blob;
}

/**
 * NOTE: this route does not exist in the Postman collection at all (the
 * "my document e" request has no URL) — see CHANGELOG.md ("Missing my
 * documents endpoint"). This call targets the natural path
 * (`my-documents`) pending the backend defining it.
 */
export async function listMyDocuments(options?: RequestOptions): Promise<EmployeeDocument[]> {
  const response = await httpClient.get(endpoints.documents.myDocuments, options);
  return unwrap<EmployeeDocument[]>(response);
}

export async function downloadDocument(id: number, options?: RequestOptions): Promise<Blob> {
  const response = await httpClient.get(endpoints.documents.downloadDocument(id), {
    ...options,
    responseType: "blob",
  });
  return response.data as Blob;
}
