import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "../profiles";
import { queryKeys } from "../queryKeys";
import type { CreateProfilePayload, UpdateProfilePayload } from "../models";

export function useMyProfile() {
  return useQuery({
    queryKey: queryKeys.profiles.mine(),
    queryFn: () => api.getMyProfile(),
  });
}

export function useProfile(id: number) {
  return useQuery({
    queryKey: queryKeys.profiles.detail(id),
    queryFn: () => api.getProfile(id),
    enabled: Number.isFinite(id),
  });
}

export function useCreateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateProfilePayload) => api.createProfile(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.profiles.all }),
  });
}

export function useUpdateProfile(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => api.updateProfile(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profiles.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.profiles.mine() });
    },
  });
}
