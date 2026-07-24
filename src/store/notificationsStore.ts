import { create } from 'zustand';

interface NotificationsState {
  notifications: {
    leaveRequests: number;
    overtimeRequests: number;
    pendingTasks: number;
  };
  updateNotifications: (notifs: NotificationsState['notifications']) => void;
}

export const useNotificationsStore = create<NotificationsState>((set) => ({
  notifications: {
    leaveRequests: 3,
    overtimeRequests: 2,
    pendingTasks: 4,
  },
  updateNotifications: (notifs) => set({ notifications: notifs }),
}));
