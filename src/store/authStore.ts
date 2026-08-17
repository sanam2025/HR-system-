import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

/**
 * Roles as returned by the Laravel backend's `user.role` field. Sourced from
 * the folder/suffix conventions in the Postman collection: `m` = manager,
 * `h` = HR, `e` = employee, plus `admin` (present in the frontend layouts but
 * not exercised anywhere in the Postman collection — see CHANGELOG.md).
 */
export const UserRole = {
  Admin: "admin",
  Manager: "manager",
  Hr: "hr",
  Employee: "employee",
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export interface AuthUser {
  id: number;
  fullName: string;
  email: string;
  role: UserRole;
  departmentId?: number | null;
  avatarUrl?: string | null;
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  /** True once the persisted store has been read back from localStorage. */
  hasHydrated: boolean;
  isAuthenticated: () => boolean;
  setSession: (token: string, user: AuthUser) => void;
  setUser: (user: AuthUser) => void;
  clearSession: () => void;
  setHasHydrated: (value: boolean) => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      hasHydrated: false,
      isAuthenticated: () => Boolean(get().token),
      setSession: (token, user) => set({ token, user }),
      setUser: (user) => set({ user }),
      clearSession: () => set({ token: null, user: null }),
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: "masar-hr.auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ token: state.token, user: state.user }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

export default useAuthStore;

/** Non-reactive accessor for use outside React (e.g. the axios interceptor). */
export function getAuthToken(): string | null {
  return useAuthStore.getState().token;
}
