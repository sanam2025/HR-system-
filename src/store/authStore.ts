import { create } from 'zustand';

interface AuthState {
  currentUser: {
    id: number;
    name: string;
    role: string;
    departmentId: number;
  };
}

export const useAuthStore = create<AuthState>(() => ({
  currentUser: { id: 99, name: 'م. سامر الرشيد', role: 'MANAGER', departmentId: 1 },
}));
