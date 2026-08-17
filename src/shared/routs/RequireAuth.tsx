import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuthStore from "../../store/authStore";

/**
 * Waits for the persisted auth store to rehydrate from localStorage before
 * deciding to redirect — otherwise a page refresh would flash a redirect to
 * `/login` for an already-signed-in user for one render tick.
 */
export default function RequireAuth({ children }: { children: ReactNode }) {
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());
  const location = useLocation();

  if (!hasHydrated) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}
