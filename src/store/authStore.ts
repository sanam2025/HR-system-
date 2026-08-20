import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

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
  hasHydrated: boolean;
  currentUser: Record<string, unknown> | null;

  // New interface (used by employee pages)
  isAuthenticated: () => boolean;
  setSession: (token: string, user: AuthUser) => void;
  setUser: (user: AuthUser) => void;
  clearSession: () => void;
  setHasHydrated: (value: boolean) => void;

  // Legacy interface (used by Login.tsx and other existing pages)
  setToken: (token: string) => void;
  setCurrentUser: (user: Record<string, unknown>) => void;
  logout: () => void;
}

const useAuthStoreDefault = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      hasHydrated: false,
      currentUser: null,

      // New interface
      isAuthenticated: () => Boolean(get().token),
      setSession: (token, user) => set({ token, user }),
      setUser: (user) => set({ user }),
      clearSession: () => set({ token: null, user: null, currentUser: null }),
      setHasHydrated: (value) => set({ hasHydrated: value }),

      // Legacy interface
      setToken: (token: string) => set({ token }),
      setCurrentUser: (user: Record<string, unknown>) => {
        // Map legacy user shape to AuthUser shape for new pages
        const authUser: AuthUser = {
          id: Number(user.id ?? 0),
          fullName: String(user.name ?? user.fullName ?? user.full_name ?? ""),
          email: String(user.email ?? ""),
          role: (String(user.role ?? "employee").toLowerCase()) as UserRole,
          departmentId: user.departmentId != null ? Number(user.departmentId) : null,
        };
        set({ currentUser: user, user: authUser });
      },
      logout: () => set({ token: null, user: null, currentUser: null }),
    }),
    {
      name: "masar-hr.auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ token: state.token, user: state.user, currentUser: state.currentUser }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

export default useAuthStoreDefault;
export const useAuthStore = useAuthStoreDefault;

export function getAuthToken(): string | null {
  return useAuthStoreDefault.getState().token;
}
