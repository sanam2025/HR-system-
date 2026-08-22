import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as authApi from "../authEmployee";
import useAuthStore from "../../store/authStore";
import type { LoginPayload } from "../authEmployee";

export function useLogin() {
  const setSession = useAuthStore((s) => s.setSession);
  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: (result) => setSession(result.token, result.user),
  });
}

export function useLogout() {
  const clearSession = useAuthStore((s) => s.clearSession);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: () => {      clearSession();
      queryClient.clear();
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: authApi.ChangePasswordPayload) => authApi.changePassword(payload),
  });
}
