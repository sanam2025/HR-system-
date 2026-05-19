import { create } from 'zustand';

interface ManagerState {
  currentUser: {
    id: number;
    name: string;
    role: string;
    departmentId: number;
  };
  notifications: {
    leaveRequests: number;
    overtimeRequests: number;
    pendingTasks: number;
  };
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  updateNotifications: (notifs: ManagerState['notifications']) => void;
}

const useManagerStore = create<ManagerState>((set) => ({
  // Auth / current user
  currentUser: { id: 99, name: 'م. سامر الرشيد', role: 'MANAGER', departmentId: 1 },

  // Notifications
  notifications: {
    leaveRequests: 3,
    overtimeRequests: 2,
    pendingTasks: 4,
  },

  // Sidebar
  sidebarOpen: true,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

  // Actions
  updateNotifications: (notifs) => set({ notifications: notifs }),
}));

export default useManagerStore;
