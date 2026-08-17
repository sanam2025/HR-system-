import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { SESSION_EXPIRED_EVENT } from "../../lib/http/client";
import useAuthStore from "../../store/authStore";

/**
 * Root route element: renders the matched child route via `<Outlet />` and,
 * alongside it, subscribes to the global 401 event so an expired/invalid
 * token clears the session and redirects to `/login` no matter which page
 * or hook triggered the failing request.
 */
export default function SessionExpiryListener() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const clearSession = useAuthStore((s) => s.clearSession);

  useEffect(() => {
    function handleSessionExpired() {
      if (!useAuthStore.getState().isAuthenticated()) return; // already signed out
      clearSession();
      queryClient.clear();
      navigate("/login", { replace: true });
    }

    window.addEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);
  }, [clearSession, navigate, queryClient]);

  return <Outlet />;
}
