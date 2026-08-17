import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "../onboarding";
import { queryKeys } from "../queryKeys";
import type { OnboardingUploadPayload } from "../models";

export function useUploadOnboardingDocuments() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: OnboardingUploadPayload) => api.uploadOnboardingDocuments(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.onboarding.all }),
  });
}

export function useOnboardingStatus() {
  return useQuery({
    queryKey: queryKeys.onboarding.status(),
    queryFn: () => api.getOnboardingStatus(),
  });
}

export function useMyContract() {
  return useQuery({
    queryKey: queryKeys.documents.myContract(),
    queryFn: () => api.getMyContract(),
  });
}

export function useMyDocuments() {
  return useQuery({
    queryKey: queryKeys.documents.myDocuments(),
    queryFn: () => api.listMyDocuments(),
    retry: false, // CONFIRMED via scripts/probe_api.py: 404 Route Not Found — see CHANGELOG.md
  });
}
