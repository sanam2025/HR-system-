import { create } from 'zustand';
import { mockLeaveRequests, mockOvertimeRequests } from '../data/mockData';

interface RequestsState {
  leaveRequests: typeof mockLeaveRequests;
  overtimeRequests: typeof mockOvertimeRequests;
  updateLeaveRequestStatus: (id: number, status: string) => void;
  updateOvertimeRequestStatus: (id: number, status: string) => void;
  
  // Stubs for Interviews
  myInterviews: any[];
  myInterviewsLoading: boolean;
  fetchMyInterviews: () => void;
  rateInterview: (id: number, rate: number, notes: string) => Promise<void>;
  cancelMyInterview: (id: number) => Promise<void>;
}

export const useRequestsStore = create<RequestsState>((set) => ({
  leaveRequests: mockLeaveRequests,
  overtimeRequests: mockOvertimeRequests,

  myInterviews: [],
  myInterviewsLoading: false,
  fetchMyInterviews: () => {},
  rateInterview: async () => {},
  cancelMyInterview: async () => {},
  leaveRequests: mockLeaveRequests,
  overtimeRequests: mockOvertimeRequests,

  updateLeaveRequestStatus: (id, status) => set((state) => ({
    leaveRequests: state.leaveRequests.map(req => req.id === id ? { ...req, status } : req)
  })),

  updateOvertimeRequestStatus: (id, status) => set((state) => ({
    overtimeRequests: state.overtimeRequests.map(req => req.id === id ? { ...req, status } : req)
  })),
}));
