import { create } from 'zustand';
import { mockLeaveRequests, mockOvertimeRequests } from '../data/mockData';

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
  
  leaveRequests: typeof mockLeaveRequests;
  overtimeRequests: typeof mockOvertimeRequests;
  updateLeaveRequestStatus: (id: number, status: string) => void;
  updateOvertimeRequestStatus: (id: number, status: string) => void;
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

  leaveRequests: mockLeaveRequests,
  overtimeRequests: mockOvertimeRequests,

  updateLeaveRequestStatus: (id, status) => set((state) => ({
    leaveRequests: state.leaveRequests.map(req => req.id === id ? { ...req, status } : req)
  })),

  updateOvertimeRequestStatus: (id, status) => set((state) => ({
    overtimeRequests: state.overtimeRequests.map(req => req.id === id ? { ...req, status } : req)
  })),
}));

export default useManagerStore;
