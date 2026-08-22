
export type LeaveStatus = "pending" | "approved" | "rejected";
export type LeaveType = "annual" | "sick" | "emergency" | "unpaid";

export interface LeaveRequest {
  id: string;
  employeeName: string;
  department: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  duration: number;
  reason: string;
  status: LeaveStatus;
  processedBy?: string;
}

export interface LeaveStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

export const leaveTypeConfig: Record<LeaveType, { label: string; className: string }> = {
  annual: { label: "Annual Leave", className: "bg-blue-100 text-blue-700" },
  sick: { label: "Sick Leave", className: "bg-red-100 text-red-700" },
  emergency: { label: "Emergency Leave", className: "bg-amber-100 text-amber-700" },
  unpaid: { label: "Unpaid Leave", className: "bg-gray-100 text-gray-700" },
};

export const statusConfig: Record<LeaveStatus, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-amber-100 text-amber-700" },
  approved: { label: "Approved", className: "bg-emerald-100 text-emerald-700" },
  rejected: { label: "Rejected", className: "bg-red-100 text-red-700" },
};

export const calculateLeaveStats = (requests: LeaveRequest[]): LeaveStats => {
  return {
    total: requests.length,
    pending: requests.filter(r => r.status === "pending").length,
    approved: requests.filter(r => r.status === "approved").length,
    rejected: requests.filter(r => r.status === "rejected").length,
  };
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB");
};